// NOTE class на базе function
function GameUnitCardWindowPresenter(windowDiv, styleFloatOfBuffPanel)
{
	this.windowDiv = windowDiv;
	this.styleFloatOfBuffPanel = styleFloatOfBuffPanel;

	// todo по-хорошему также перенести в CSS
	const attackColorStyle = `#FF6767`;
	const variableTipColorStyle = `#FFEA88`;
	const grayColorStyle = `#9D9D9D`;

	this.Hide = function()
	{
		this.windowDiv.addClass("invisible");
	}

	this.Show = function(unit, unitCard)
	{
		let attackSubtableArray = this.fillAttackSubtableArray(unit, unitCard);
		let cooldownConfigSubtableArray = this.fillCooldownConfigSubtableArray(unit, unitCard);
		let cooldownCurrentSubtableArray = this.fillCooldownCurrentSubtableArray(unit);

		let frontBlockPropertySubtableArray = this.fillColoredPercentPropertySubtableArray("Блок спереди:", unitCard.blockFront * 100);
		let sideBlockPropertySubtableArray = this.fillColoredPercentPropertySubtableArray("Блок сбоку:", unitCard.blockSide * 100);
		let armorPropertySubtableArray = this.fillColoredPercentPropertySubtableArray("Броня:", CalculateUnitFinalArmorPercent(unitCard, unit.effects));

		// todo NOTE вместо "container" сделано на display: table; + display: table-row; + display: table-cell;
		// todo NOTE что делает авто-ширину колонок
		// todo NOTE (у "container" колонки вида "col-5" + "col-5" + "col-2" будут фикс, но иногда не убрается текст и подогнать не реально)
		//
		// todo NOTE но нет аналога colspan, что приводит к тому что только первую колонку занимает - имя юнита (расширяет всю 1ю колонку)
		// todo NOTE (и подчеркивание не на всю ширину)
		// todo NOTE .. это компромисс
		//
		this.windowDiv.html(`
			<div class="row" style="margin-top: 6px;"><div class="col-12">
				<div style="background-color: #000000B4" class="container-table rounded">
					<div class="row">
						<div class="col-12"><span class="battle-unit-card-window-text text-white" style="border-bottom: 1px solid #FFF;">` + unitNames[unit.type].toUpperCase() + `</span></div>
					</div>
					<div class="row">
						<div class="col-5"><span class="battle-unit-card-window-text" style="color: #FFFFFFB0">` + (unitCard.isAlive ? "Одушевлённый" : "Неодушевлённый") + `</span></div>
						<div class="col-5">` + attackSubtableArray[0] + `</div>
						<div class="col-2">` + attackSubtableArray[1] + `</div>
					</div>
					<div class="row">
						<div class="col-5"><span class="battle-unit-card-window-text" style="color: #2CFB28">`
							+ ("Здоровье: " + unit.currentHealth) + `</span><span class="battle-unit-card-window-text" style="color: ` + grayColorStyle + `">` + ("/" + unit.health) + `</span></div>
						<div class="col-5">` + attackSubtableArray[2] + `</div>
						<div class="col-2">` + attackSubtableArray[3] + `</div>
					</div>
					<div class="row">
						<div class="col-5"><span class="battle-unit-card-window-text" style="color: ` + (unitCard.moveDistance > 0 ? `#FFFFFF` : grayColorStyle) + `">` + ("Движение: " + unitCard.moveDistance) + `</span></div>
						<div class="col-5">` + attackSubtableArray[4] + `</div>
						<div class="col-2">` + attackSubtableArray[5] + `</div>
					</div>
					<div class="row">
						<div class="col-5">` + cooldownConfigSubtableArray[0] + `</div>
						<div class="col-5">` + cooldownConfigSubtableArray[1] + `</div>
						<div class="col-2">` + cooldownConfigSubtableArray[2] + `</div>
					</div>
					<div class="row">
						<div class="col-5"></div>
						<div class="col-5">` + frontBlockPropertySubtableArray[0] + `</div>
						<div class="col-2">` + frontBlockPropertySubtableArray[1] + `</div>
					</div>
					<div class="row">
						<div class="col-5">` + cooldownCurrentSubtableArray[0] + `</div>
						<div class="col-5">` + sideBlockPropertySubtableArray[0] + `</div>
						<div class="col-2">` + sideBlockPropertySubtableArray[1] + `</div>
					</div>
					<div class="row">
						<div class="col-5">` + cooldownCurrentSubtableArray[1] + `</div>
						<div class="col-5">` + armorPropertySubtableArray[0] + `</div>
						<div class="col-2">` + armorPropertySubtableArray[1] + `</div>
					</div>
				</div>
			</div></div>`
			+ // todo баффы ..
			`<div class="row" style="margin-top: 2px; float: ` + this.styleFloatOfBuffPanel + `;"><div class="col-12">
			</div></div>`
		);

		this.windowDiv.removeClass("invisible");
	}

	this.fillColoredPercentPropertySubtableArray = function(title, value)
	{
		let colorStyle = (value > 0 ? `#FFFFFF` : grayColorStyle);
		return [
			`<span class="battle-unit-card-window-text" style="color: ` + colorStyle + `">` + title + `</span>`,
			`<span class="battle-unit-card-window-text" style="color: ` + colorStyle + `">` + value + "%" + `</span>`
		];
	}

	this.fillAttackSubtableArray = function(unit, unitCard)
	{
		let critChanceColorStyle = (unitCard.critChance > 0 ? attackColorStyle : grayColorStyle);
		return [
			`<span class="battle-unit-card-window-text-attack">Атака:</span>`,
			`<span class="battle-unit-card-window-text-attack">` + unitCard.strength + `</span>`,
			`<span class="battle-unit-card-window-text-attack">Дальность атаки:</span>`,
			`<span class="battle-unit-card-window-text-attack">` + unitCard.range + `</span>`,
			`<span class="battle-unit-card-window-text" style="color: ` + critChanceColorStyle + `">Шанс крита:</span>`,
			`<span class="battle-unit-card-window-text" style="color: ` + critChanceColorStyle + `">` + (unitCard.critChance * 100 + "%") + `</span>`,
		];
	}

	this.fillCooldownConfigSubtableArray = function(unit, unitCard)
	{
		let result = [``, ``, ``];

		if (unitCard.moveDistance > 0)
		{
			result[0] = `<span class="battle-unit-card-window-text" style="color: ` + (unitCard.cooldownMove > 0 ? `#FFFFFF` : grayColorStyle) + `">Перезарядка движения: ` + GetTextWithTurnsCount(unitCard.cooldownMove) + `</span>`;
		}

		if (!unitCard.isUncontrollable)
		{
			result[1] = `<span class="battle-unit-card-window-text" style="color: ` + (unitCard.cooldownAttack > 0 ? attackColorStyle : grayColorStyle) + `">Перезарядка атаки:` + `</span>`;
			result[2] = `<span class="battle-unit-card-window-text" style="color: ` + (unitCard.cooldownAttack > 0 ? attackColorStyle : grayColorStyle) + `">` + GetTextWithTurnsCount(unitCard.cooldownAttack) + `</span>`;
		}

		return result;
	}

	this.fillCooldownCurrentSubtableArray = function(unit)
	{
		let cooldown = unit.cooldown;
		if (cooldown > 0)
		{
			return [
				`<span class="battle-unit-card-window-text" style="color: ` + variableTipColorStyle + `">Отдых ` + GetTextWithTurnsCount(cooldown) + `</span>`,
				`<span class="battle-unit-card-window-text" style="color: ` + variableTipColorStyle + `">(не атакует, не двигается)</span>`
			];
		}

		return [
			``,
			``
			];
	}
}