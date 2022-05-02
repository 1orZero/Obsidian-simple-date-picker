import dayjs, { Dayjs } from "dayjs";
import * as React from "react";

interface DaysType {
	day: number;
	dayjs: Dayjs;
}

const controller = {
	time: dayjs(),
};
function getTime() {
	return {
		month: controller.time.format("MMM"),
		year: controller.time.format("YYYY"),
		days: [
			..._getPrevMonthDays(),
			..._getCurrentMonthDays(),
			..._getNextMonthDays(),
		],
	};
}
function _getCurrentMonthDays() {
	return _createNumberArray(controller.time.daysInMonth(), controller.time);
}
function _getPrevMonthDays() {
	// Length of prev month days needs to add to the days array
	const neededLength = controller.time.startOf("month").day();
	const prevMonthDays = _createNumberArray(
		controller.time.subtract(1, "month").daysInMonth(),
		controller.time.subtract(1, "month")
	);

	return prevMonthDays.slice(prevMonthDays.length - neededLength);
}
function _getNextMonthDays() {
	// Length of next month days needs to add to the days array
	const neededLength = 6 - controller.time.endOf("month").day();
	const nextMonthDays = _createNumberArray(
		controller.time.add(1, "month").daysInMonth(),
		controller.time.add(1, "month")
	);

	return nextMonthDays.slice(0, neededLength);
}
function _createNumberArray(length: number, dayjs: Dayjs): DaysType[] {
	return Array.from({ length }, (_, index) => {
		return {
			day: index + 1,
			dayjs: dayjs.set("date", index + 1),
		};
	});
}

export default function Calendar({
	onClick,
}: {
	onClick: (date: string) => void;
}) {
	const [key, setKey] = React.useState(0);
	function updateTime(newValue: Dayjs) {
		controller.time = newValue;
		setKey(key + 1);
	}

	React.useEffect(() => {
		setTime(() => {
			return getTime();
		});
	}, [key]);

	const [time, setTime] = React.useState(getTime());

	return (
		<div className="Picker">
			{/* LEFT RIGHT BUTTON AND MONTH TEXT */}
			<CalendarHeader
				month={time.month}
				year={time.year}
				prevCallback={() =>
					updateTime(controller.time.subtract(1, "month"))
				}
				nextCallback={() => updateTime(controller.time.add(1, "month"))}
			/>
			{/* MONTH VIEW */}
			<CalendarMonthView daysArray={time.days} onClick={onClick} />
		</div>
	);
}

function CalendarHeader({
	month,
	year,
	prevCallback,
	nextCallback,
}: {
	month: string;
	year: string;
	prevCallback: () => void;
	nextCallback: () => void;
}): JSX.Element {
	return (
		<section className="PickerHeader">
			<div
				onClick={prevCallback}
				className="PickerHeaderButton"
			>{`<`}</div>
			<label className="PickerHeaderMonthYearTitle">{`${month} ${year}`}</label>
			<div
				onClick={nextCallback}
				className="PickerHeaderButton"
			>{`>`}</div>
		</section>
	);
}

function CalendarMonthView({
	daysArray,
	onClick,
}: {
	daysArray: DaysType[];
	onClick: (date: string) => void;
}) {
	return (
		<div className="PickerDaysView">
			<Weeks />
			<Days daysArray={daysArray} onClick={onClick} />
		</div>
	);
}

function Weeks() {
	const weeks = ["S", "M", "T", "W", "T", "F", "S"];
	return (
		<div className="PickerWeeksContainer">
			{weeks.map((week, index) => (
				<div key={index} className="PickerWeeksItem">
					{week}
				</div>
			))}
		</div>
	);
}
function Days({
	daysArray,
	onClick,
}: {
	daysArray: DaysType[];
	onClick: (date: string) => void;
}) {
	let active = false;
	const classObject = () =>
		active ? "PickerDaysItemActive" : "PickerDaysItemInactive";
	const renderDaysArray = daysArray.map((day, index) => {
		if (day.day === 1) {
			active = !active;
		}
		return {
			day: day.day,
			dayjs: day.dayjs,
			className: classObject(),
			onClick: active
				? () => onClick(day.dayjs.format("YYYY-MM-DD"))
				: () => null,
		};
	});

	return (
		<div className="PickerDaysContainer">
			{renderDaysArray.map((day, index) => {
				return (
					<div
						key={index}
						className={day.className}
						onClick={() => day.onClick()}
					>
						{day.day}
					</div>
				);
			})}
		</div>
	);
}
