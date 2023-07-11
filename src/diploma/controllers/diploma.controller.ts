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

    const conflictingUser = await userRepository.findOne({
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

    let control = new Control();

    if (!diplomaPayload.diplomaId) {
      //create diploma
      let diploma = new Diploma();
      diploma.teacherId = diplomaPayload.teacherId;
      diploma.studentId = res.locals.jwt.payload.userId;
      diploma.type = diplomaPayload.type;
      diploma = await diplomaRepository.save(diploma);
      // create control
      control.diplomaId = diploma.id;
    }
    if (diplomaPayload.diplomaId && diplomaPayload.rank) {
      control = await controlRepository.findOne({
        where: { diplomaId: diplomaPayload.diplomaId, rank: diplomaPayload.rank, status: CONTROL_STATUS.REFUSED },
      });
    }

    DiplomaController.upsertControl(control, diplomaPayload);
    control.document = req.file.filename;
    control.originalDocument = req.file.originalname;
    control.sentDate = new Date();
    control = await controlRepository.save(control);

    const user = await userRepository.findOne({ where: { id: res.locals.jwt.payload.userId } });
    await userRepository.save(userRepository.merge(user, { uniqueNumber: diplomaPayload.uniqueNumber }));
    return res.send(control);
  };

  public static get = async (req: Request, res: Response) => {
    const teachers = await getRepository(User).find({ where: { role: Roles.TEACHER } });
    const diploma = await getRepository(Diploma).findOne({
      where: { studentId: res.locals.jwt.payload.userId, type: req.query.type },
    });
    const student = await getRepository(User).findOne({ where: { id: res.locals.jwt.payload.userId } });
    if (!diploma) {
      return res.send({
        teachers: teachers.map((t) => ({ ...t, teacherId: t.id })),
        diploma: {},
        control: { student },
        student,
      });
    }
    const control = await getRepository(Control).findOne({
      where: {
        diplomaId: diploma.id,
        rank: req.query.rank,
      },
    });

    const myTeacher = teachers.find((t) => t.id === diploma.teacherId);

    res.send({
      teachers: teachers.map((t) => ({ ...t, teacherId: t.id })),
      diploma: { ...diploma, diplomaId: diploma.id },
      control: { ...(control ?? {}), teacher: myTeacher, student },
    });
  };

  private static upsertControl = (control, diplomaPayload) => {
    control.rank = diplomaPayload.rank;
    control.status = CONTROL_STATUS.PENDING;
    control.sentDate = diplomaPayload.sentDate;
    control.title = diplomaPayload.title;
    control.from = diplomaPayload.from;
    control.to = diplomaPayload.to;
    control.studyProgram = diplomaPayload.studyProgram;

    return control;
  };

  public static getForTeachers = async (req: Request, res: Response) => {
    const limit = 100;
    const students = await getRepository(User)
      .createQueryBuilder("students")
      .select("students.name, controls.*, users.name as teacherName")
      .leftJoin("diplomas", "diplomas", "diplomas.studentId = students.id")
      .innerJoin("controls", "controls", "controls.diplomaId = diplomas.id")
      .innerJoin("users", "users", "users.id = diplomas.teacherId")
      .where("diplomas.teacherId = :id", { id: res.locals.jwt.payload.userId })
      .andWhere("controls.rank = :rank", { rank: req.query.rank })
      .orderBy("students.id", "DESC")
      // .limit(limit)
      // .offset((+req.query.page - 1) * limit)
      .getRawMany();

    res.status(200).json({ students });
  };

  public static updateControl = async (req: Request, res: Response) => {
    let control = await getRepository(Control).findOneOrFail({ where: { id: req.body.id } });
    await getRepository(Control).update(req.body.id, { status: req.body.status });
    control.status = req.body.status;
    res.status(200).json({ control });
  };

  public static search = async (req: Request, res: Response) => {
    return getRepository(Diploma)
      .createQueryBuilder("diplomas")
      .leftJoinAndSelect("diplomas.controls", "controls")
      .where(req.body.title ? `controls.title LIKE '%${req.body.title}%'` : "true")
      .andWhere(req.body.from ? `controls.from <= ${req.body.from}` : "true")
      .andWhere(req.body.to ? `controls.to >= ${req.body.to}` : "true")
      .andWhere(req.body.teacherId ? `diplomas.teacherId = ${req.body.teacherId}` : "true")
      .andWhere(req.body.rank ? `controls.rank = ${req.body.rank}` : "true")
      .andWhere(req.body.studyProgram ? `controls.studyProgram = ${req.body.studyProgram}` : "true")
      .andWhere(req.body.type ? `diplomas.type= ${req.body.type}` : "true")
      .getMany();
  };

  public static getTeachers = async (req: Request, res: Response) => {
    return getRepository(User).find({ where: { role: Roles.TEACHER } });
  };
}
