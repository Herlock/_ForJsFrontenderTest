function CalculateUnitFinalArmorPercent(unitCard, unitEffectsObject)
{
    let armorPercent = unitCard.armor * 100;
    if (unitEffectsObject.isOnArmor)
    {
        armorPercent += spellsConfig.MasterOltrodor_ArmorIncreasePercent;
    }
    return armorPercent;
}

function GetTextWithTurnsCount(turnsCount)
{
    if (turnsCount === 0) return "0 ходов";
    if (turnsCount === 1) return "1 ход";
    if (turnsCount >= 2 && turnsCount <= 4) return turnsCount + " хода";
    return turnsCount + " ходов";
}