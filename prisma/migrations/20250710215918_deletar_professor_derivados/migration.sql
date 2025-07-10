-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Avaliacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioID" INTEGER NOT NULL,
    "professorID" INTEGER,
    "disciplinaID" INTEGER,
    "conteudo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Avaliacao_usuarioID_fkey" FOREIGN KEY ("usuarioID") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Avaliacao_professorID_fkey" FOREIGN KEY ("professorID") REFERENCES "Professor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Avaliacao_disciplinaID_fkey" FOREIGN KEY ("disciplinaID") REFERENCES "Disciplina" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Avaliacao" ("conteudo", "createdAt", "disciplinaID", "id", "professorID", "updatedAt", "usuarioID") SELECT "conteudo", "createdAt", "disciplinaID", "id", "professorID", "updatedAt", "usuarioID" FROM "Avaliacao";
DROP TABLE "Avaliacao";
ALTER TABLE "new_Avaliacao" RENAME TO "Avaliacao";
CREATE TABLE "new_professorDisciplina" (
    "professorID" INTEGER NOT NULL,
    "disciplinaID" INTEGER NOT NULL,

    PRIMARY KEY ("professorID", "disciplinaID"),
    CONSTRAINT "professorDisciplina_professorID_fkey" FOREIGN KEY ("professorID") REFERENCES "Professor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "professorDisciplina_disciplinaID_fkey" FOREIGN KEY ("disciplinaID") REFERENCES "Disciplina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_professorDisciplina" ("disciplinaID", "professorID") SELECT "disciplinaID", "professorID" FROM "professorDisciplina";
DROP TABLE "professorDisciplina";
ALTER TABLE "new_professorDisciplina" RENAME TO "professorDisciplina";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
