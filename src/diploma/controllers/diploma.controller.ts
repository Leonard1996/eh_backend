import { Request, Response } from "express";
import { Not, getRepository } from "typeorm";
import { Diploma } from "../entities/diploma.entity";
import { CONTROL_STATUS, Control } from "../../control/entities/control.entity";
import { Roles, User } from "../../user/entities/user.entity";

export class DiplomaController {
  public static create = async (req: Request, res: Response) => {
    const diplomaRepository = getRepository(Diploma);
    const controlRepository = getRepository(Control);
    const userRepository = getRepository(User);
    const diplomaPayload = req.body;
    const conflictingUser = userRepository.findOne({
      where: {
        uniqueNumber: diplomaPayload.uniqueNumber,
        id: Not(res.locals.jwt.payload.userId),
      },
    });

    if (conflictingUser) {
      return res.sendStatus(409).json({
        message: "Ky numer matrikulimi i perket nje studenti ekzistues",
      });
    }

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

    const user = await userRepository.findOne({ where: { id: res.locals.jwt.payload.userId } });
    await userRepository.save(userRepository.merge(user, { uniqueNumber: diplomaPayload.uniqueNumber }));
    return res.send(control);
  };

  public static get = async (req: Request, res: Response) => {
    const teachers = await getRepository(User).find({ where: { role: Roles.TEACHER } });
    const diplomas = await getRepository(Diploma)
      .createQueryBuilder("diploma")
      .leftJoinAndSelect("diploma.controls", "control")
      .where("`rank` = :rank", { rank: req.query.rank })
      .andWhere("studentId = :userId", { userId: res.locals.jwt.payload.userId })
      .getMany();

    res.send({
      teachers: teachers.map((t) => ({ ...t, teacherId: t.id })),
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

  public static getForTeachers = async (req: Request, res: Response) => {
    const limit = 3;
    const students = await getRepository(User)
      .createQueryBuilder("students")
      .leftJoin("diplomas", "diplomas", "diplomas.studentId = students.id")
      .where("diplomas.teacherId = :id", { id: res.locals.jwt.payload.userId })
      .orderBy("students.id", "DESC")
      .limit(limit)
      .offset((+req.query.page - 1) * limit)
      .getMany();

    res.status(200).json({ students });
  };
}
