export enum SubjectType {
  None = 1,
  /** Русский язык */
  RussianLanguage,
  /** Математика (профильный уровень) */
  Mathematics_ProfileLevel,
  /** Обществознание */
  SocialStudies,
  /** Физика */
  Physics,
  /** Литература */
  Literature,
  /** История */
  History,
  /** Химия */
  Chemistry,
  /** Иностранный язык */
  ForeignLanguage,
  /** Биология */
  Biology,
  /** Информатика и ИКТ */
  ComputerScience_ICT,
  /** География */
  Geography,
}

type RecordSubjectTypes = Partial<Record<SubjectType, number>>;

/** Минимальные баллы ЕГЭ для поступления в ВУЗ */
export const minEgeScores: Record<number, RecordSubjectTypes> = {
  2023: {
    // [SubjectType.None]: 100,
    [SubjectType.RussianLanguage]: 40,
    [SubjectType.Mathematics_ProfileLevel]: 39,
    [SubjectType.SocialStudies]: 45,
    [SubjectType.Physics]: 39,
    [SubjectType.Literature]: 40,
    [SubjectType.History]: 35,
    [SubjectType.Chemistry]: 39,
    [SubjectType.ForeignLanguage]: 30,
    [SubjectType.Biology]: 39,
    [SubjectType.ComputerScience_ICT]: 44,
    [SubjectType.Geography]: 40,
  },
};

export const getMinScoresByYear = (year = new Date().getFullYear()) => {
  const years = Object.keys(minEgeScores) as any as number[];
  return minEgeScores[years.includes(year) ? year : Math.max(year)] || null;
};

export const findSubjectType = (subjectName: string) => {
  const sn = subjectName.trim().toLocaleLowerCase().replace(/\s/g, ' ');
  const check = (str: string) => sn.startsWith(str.toLocaleLowerCase()) || str.toLocaleLowerCase() === sn;
  const inclues = (str: string) => sn.includes(str.toLocaleLowerCase());

  let type: SubjectType | null = null;

  if (check('Русский язык')) {
    type = SubjectType.RussianLanguage;
  } else if (check('Математика')) {
    type = SubjectType.Mathematics_ProfileLevel;
  } else if (inclues('информатика') && inclues(' ИКТ')) {
    type = SubjectType.ComputerScience_ICT;
  } else if (check('Обществознание')) {
    type = SubjectType.SocialStudies;
  } else if (check('Физика')) {
    type = SubjectType.Physics;
  } else if (check('Литература')) {
    type = SubjectType.Literature;
  } else if (check('История')) {
    type = SubjectType.History;
  } else if (check('Химия')) {
    type = SubjectType.Chemistry;
  } else if (check('Иностранный язык') || check('Английский язык') || check('Немецкий язык')) {
    type = SubjectType.ForeignLanguage;
  } else if (check('Биология')) {
    type = SubjectType.Biology;
  } else if (check('География')) {
    type = SubjectType.Geography;
  } else if (check('Безопасность жизнедеятельности')) {
    // type = SubjectType.;
  }

  return type;
};

export const getSubjectMinScore = (subjectName: string, year?: number) => {
  const minScores = getMinScoresByYear(year);
  if (!minScores) return null;
  const type = findSubjectType(subjectName);
  return type !== null ? minScores[type] : null;
};

export const findSubjectMinScore = (subjectNames: string, year?: number) => {
  const minScores = getMinScoresByYear(year);
  if (!minScores) return null;

  const subjects = subjectNames.split('/').map((e) => e.trim());

  const scores: RecordSubjectTypes = {};
  for (const name of subjects) {
    const type = findSubjectType(name);
    if (type !== null) {
      scores[type] = minScores[type];
    }
  }

  return scores;
};

export const getMaxSubjectMinScore = (subjectNames: string, year?: number, uid?: string) => {
  const scores = findSubjectMinScore(subjectNames, year);
  if (!scores) return null;

  let mostMaxScore: number | null = null;
  for (const [type, score] of Object.entries(scores)) {
    if (!mostMaxScore) mostMaxScore = score;
    if (mostMaxScore < score) mostMaxScore = score;
  }
  // console.log(uid, subjectNames, scores, mostMaxScore);
  return mostMaxScore;
};
