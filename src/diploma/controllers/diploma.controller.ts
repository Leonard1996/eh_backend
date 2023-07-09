import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Diploma } from "../entities/diploma.entity";
import { CONTROL_STATUS, Control } from "../../control/entities/control.entity";
import { Roles, User } from "../../user/entities/user.entity";

export class DiplomaController {
  public static create = async (req: Request, res: Response) => {
    const diplomaRepository = getRepository(Diploma);
    const controlRepository = getRepository(Control);
    const diplomaPayload = req.body;
    let control;

    if (!diplomaPayload.diplomaId) {
      //create diploma
      let diploma = new Diploma();
      diploma.teacherId = diplomaPayload.teacherId;
      diploma.studentId = res.locals.jwt.payload.userId;
      diploma = await diplomaRepository.save(diploma);
      // create control
      control = new Control();
      control.diplomaId = diploma.id;
    }

    if (diplomaPayload.diplomaId) {
      control = await controlRepository.findOne({
        where: { diplomaId: diplomaPayload.diplomaId, rank: diplomaPayload.rank, status: CONTROL_STATUS.REFUSED },
      });
    }

    DiplomaController.upsertControl(control, diplomaPayload);
    control.document = req.file.filename;
    await controlRepository.save(control);

    return res.send(control);
  };

  public static get = async (req: Request, res: Response) => {
    const teachers = await getRepository(User).find({ where: { role: Roles.TEACHER } });
    const diplomas = await getRepository(Diploma)
      .createQueryBuilder("diploma")
      .leftJoinAndSelect("diploma.controls", "control")
      .where("`rank` = :rank", { rank: req.body.rank })
      .andWhere("studentId = :userId", { userId: res.locals.jwt.payload.userId })
      .getMany();

    res.send({
      teachers,
      diplomas: diplomas.map((d) => ({ ...d, diplomaId: d.id })),
    });
  };

  private static upsertControl = (control, diplomaPayload) => {
    control.rank = diplomaPayload.rank;
    control.status = CONTROL_STATUS.PENDING;
    control.sentDate = diplomaPayload.sentDate;
    control.title = diplomaPayload.title;
    control.from = diplomaPayload.from;
    control.to = diplomaPayload.to;

    return control;
  };
}
