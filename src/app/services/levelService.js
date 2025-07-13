const { prisma } = require('../../config/db');

const XP_PER_CORRECT = 10;

const LEVEL_THRESHOLDS = [0, 50, 120, 200, 300, 450, 600];

async function addXP(userId, correctCount) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    let newXP = user.xp + correctCount * XP_PER_CORRECT;

    let newLevel = user.level;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (newXP >= LEVEL_THRESHOLDS[i]) {
            newLevel = i + 1;
            break;
        }
    }

    await prisma.user.update({
        where: { id: userId },
        data: { xp: newXP, level: newLevel }
    });

    await unlockAchievements(userId, newLevel);
}

async function unlockAchievements(userId, level) {
    const achievements = await prisma.achievement.findMany({
        where: { levelReq: { lte: level } }
    });

    for (const achievement of achievements) {
        const exists = await prisma.userAchievement.findFirst({
            where: {
                userId,
                achievementId: achievement.id
            }
        });

        if (!exists) {
            await prisma.userAchievement.create({
                data: {
                    userId,
                    achievementId: achievement.id
                }
            });
        }
    }
}

function calculateXPProgress(xp, level) {
    const xpMin = LEVEL_THRESHOLDS[level - 1] || 0;
    const xpMax = LEVEL_THRESHOLDS[level] || (xpMin + 100);

    const xpProgress = Math.min(
        Math.floor(((xp - xpMin) / (xpMax - xpMin)) * 100),
        100
    );

    return {
        xpMin,
        xpMax,
        xpProgress
    };
}

module.exports = {
    addXP,
    calculateXPProgress
};
