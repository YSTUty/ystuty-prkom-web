export type IncomingsLink = {
  title: string;
  name: string;
  desc: string;
  /** Link to pdf file */
  docLink: string;
  specialties: Omit<SpecRecInfo, 'list' | 'titles'>[];
};

/** Тип состояния заявления */
export enum AbiturientInfoStateType {
  Unknown = 0,
  Submitted = 1,
  Enrolled = 2,
}

/** Тип формы обучения */
export enum FormTrainingType {
  Unknown = 0,
  FullTime = 1,
  Extramural = 2,
  PartTime = 3,
}

/** Тип уровня образования */
export enum LevelTrainingType {
  Unknown = 0,
  /** Бакалавриат */
  Bachelor = 1,
  /** Магистратура */
  Magister = 2,
  /** Аспирантура */
  Postgraduate = 3,
  /** Специалитет */
  Specialty = 4,
}

/** Оригинальная информация на странице списка поступающих */
export type IncomingsPageOriginalInfo = {
  /** @example `Дата формирования - 07.07.2022. Время формирования - 15:00:00.` */
  buildDate: string;
  // /** @example `Приемная кампания- Приемная кампания 222 от 31.03.2022 14:06:34` */
  // prkomDate: string;
  // /** @example `Конкурсная группа - Управление по программированию` */
  // competitionGroupName: string;
  /** @example `Форма обучения - Очная` */
  formTraining: string;
  // /** @example `Уровень подготовки - Магистр` */
  // levelTraining: string;
  // /** @example `УГС/Направление подготовки/специальность - 27.04.04 Управление в технических системах` */
  // directionTraining: string;
  /** @example `Основание поступления - Бюджетная основа` */
  basisAdmission: string;
  // /** @example `Источник финансирования - Федеральный бюджет` */
  // sourceFunding: string;
  /** @example `Категория приема - Основные места в рамках контрольных цифр` */
  admissionCategory: string;
  /** @example `Подразделение - Исторический факультет / Обществознание и социально-политическая работа` */
  division: string;
  /** @example `Всего мест: 9. Зачислено: 0. К зачислению: 9.` */
  numbersInfo: string;
};

/** Информация на странице списка поступающих */
export type IncomingsPageInfo = {
  /** Дата и время формирования */
  buildDate: Date;
  /** Приемная кампания @deprecated nope in YSPU */
  prkom: {
    /** Номер приемной кампании */
    number: number;
    /** Дата формирования приемной кампании */
    date: Date;
  };
  /**
   * Конкурсная группа
   * //@deprecated nope in YSPU
   */
  competitionGroupName: string;
  /** Форма обучения */
  formTraining: FormTrainingType;
  /** Особенности приема */
  receptionFeatures: 'separate' | 'common' | 'none';
  /** Уровень подготовки @deprecated nope in YSPU */
  levelTraining: number;
  /** Направление подготовки/специальность @deprecated nope in YSPU */
  directionTraining: {
    /** Код */
    code: string;
    /** Название */
    name: string;
  };
  /** Основание поступления */
  basisAdmission: string;
  /** Категория приема */
  admissionCategory: string;
  /** Подразделение */
  division: string;

  /** Источник финансирования @deprecated nope in YSPU */
  sourceFunding: string;

  /** Места */
  numbersInfo: {
    /** Всего мест */
    total: number;
    /** Зачислено */
    enrolled: number;
    /** К зачислению */
    toenroll: number;
  };
};

export type AbiturientInfo = AbiturientInfo_Bachelor | AbiturientInfo_Magister;
export type AbiturientInfoComb = AbiturientInfo_Bachelor & AbiturientInfo_Magister;

export type AbiturientInfo_Base = {
  /** Выделен зеленым */
  isGreen: boolean;
  /** Выделен красным */
  isRed: boolean;
  /** Номер позиции в списке */
  position: number;
  /** Уникальный код */
  uid: string;
  /** Сумма баллов */
  totalScore: number;
  /** Сумма баллов по предметам */
  scoreSubjectsSum: number;
  /** Сумма баллов за инд. дост. (конкурсные) */
  scoreCompetitive: number;
  /** Преимущ. право */
  preemptiveRight: boolean;
  /** Оригинал в ВУЗе */
  originalInUniversity: boolean;
  /** Оригинал из ЕПГУ */
  originalFromEGPU: boolean;
  /** Состояние */
  state: AbiturientInfoStateType | null;
  /** Приоритет */
  priority: number;
  /** Это высший приоритет */
  isHightPriority: boolean;
  /** Вид документа */
  docType: 'copy' | 'original' | null;
  /** Особенности приема */
  receptionFeatures: 'separate' | 'common' | 'none';
};

/** Информация заявления (на бакалавриат и специалитет) */
export type AbiturientInfo_Bachelor = AbiturientInfo_Base & {
  /** Баллы по предметам (балл и название предмета) */
  scoreSubjects: [number, string][];
};

/** Информация заявления (на магистратуру и аспирантуру) */
export type AbiturientInfo_Magister = AbiturientInfo_Base & {
  /** Вступительное испытание */
  scoreExam: number;
};

// export type AbiturientCachedInfo = {
//   isCache: any;
//   response: {
//     info: IncomingsPageInfo;
//     originalInfo: IncomingsPageOriginalInfo;
//     list: AbiturientInfo[];
//     titles: string[];
//   };
// };

export type SpecRecInfo = {
  info: IncomingsPageInfo;
  originalInfo: IncomingsPageOriginalInfo;
  list: AbiturientInfo[];
  titles: string[];
  hash: string;

  countPlaces: number;
  countApplications: number;
  countEnrolled: number;
};

export type AbiturientCachedInfo2 = {
  filename: string;
  response: (SpecRecInfo & { docLink: string }) | Omit<SpecRecInfo, 'list' | 'titles'>[];
};

export type AbiturientInfoResponse = {
  isCache: any;
  info: IncomingsPageInfo;
  originalInfo: IncomingsPageOriginalInfo;
  item: AbiturientInfo;
  filename: string;
  hash: string;
  payload: {
    beforeOriginals: number;
    beforeGreens: number;
    afterGreens: number;
    totalItems: number;
  };
};
