import { StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import DropdownMenu from "./Dropbox";
import RadioButton from "./RadioButton";
import ThemedSmallTextInput from "./ThemedSmallTextInput";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { RecurrenceInfo, RecurrenceInfoType } from "../../../shared/types/task";
import { ThemedButton } from "../ThemedButton";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Checkbox from "./Checkbox";
import { endAsyncEvent } from "react-native/Libraries/Performance/Systrace";

type Props = {
  rInfo?: RecurrenceInfo;
};

export type RecRef = {
  returnRecInfo: () => RecurrenceInfo | null;
};

const RecurrenceBlock = forwardRef<RecRef, Props>(({ rInfo }, ref) => {
  useImperativeHandle(ref, () => ({
    returnRecInfo,
  }));
  const recTypeOptions = [
    "Days",
    "Months",
    "Weeks",
    "Hours",
    "Minutes",
    "Years",
  ];
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayOfMonthOptions = ["1st", "2nd", "3rd", "4th", "5th", "Last"];
  const [selectedRecurrence, setSelectedRecurrence] = useState<number>(
    rInfo?.type === "BYMONTHDAY" ? 2 : rInfo ? 1 : 0
  );
  const [recFreq, setRecFreq] = useState<string | undefined>(
    rInfo?.freq ? String(rInfo?.freq) : undefined
  );
  const [recType, setRecType] = useState<string>(rInfo?.type || "Days");
  const [monthDays, setMonthDays] = useState<string>();
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>(
    rInfo?.byDay && (rInfo?.type === "BYMONTHDAY" || rInfo.type === "WEEKLY")
      ? rInfo.byDay
      : ["Su"]
  );
  const [selectedMonths, setSelectedMonths] = useState<boolean[]>([]);
  const [dayOfMonth, setDayOfMonth] = useState<string>(
    rInfo?.bySetPos
      ? dayOfMonthOptions[rInfo?.bySetPos - 1]
      : rInfo?.bySetPos === -1
      ? "Last"
      : "1st"
  );
  const [end, setEnd] = useState<string>(new Date().toISOString());
  const [endCount, setEndCount] = useState<string>();
  const [endSetting, setendSetting] = useState<number>(rInfo?.endType || 0);
  const [repeat, setRepeat] = useState<number>(
    rInfo?.fromLastCompletion && rInfo?.fromLastCompletion === true ? 1 : 0
  ); //index determines if rep happens from last completion or last due date
  useEffect(() => {
    rInfo?.byDay;
  }, []);

  const onChangeEnd = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const endDate = selectedDate || new Date();
    setEnd(endDate.toISOString());
  };

  const showMode = (
    currentMode: "time" | "date",
    date: string,
    onChange?: ((event: DateTimePickerEvent, date?: Date) => void) | undefined
  ) => {
    DateTimePickerAndroid.open({
      value: new Date(date),
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const returnRecInfo = () => {
    let data = {};
    if (selectedRecurrence === 0) {
      return null;
    }
    const updateData = (key: string, value: any) => {
      data = { ...data, [key]: value };
    };
    if (selectedRecurrence === 2) {
      //if bymonthday
      updateData("type", "BYMONTHDAY");
      if (dayOfMonth === "Last") {
        updateData("bySetPos", -1);
      } else {
        updateData("bySetPos", Number(dayOfMonth.charAt(0)));
      }
      updateData("byDay", selectedWeekdays);
    } else {
      let type = recType;
      if (recType === "Days") {
        type = "DAILY";
      } else {
        type = recType.split("s")[0];
        type += "ly";
        type = type.toUpperCase();
        // if weekly, get weekdays
        if (type === "WEEKLY") {
          updateData("byDay", selectedWeekdays);
        } else if (type === "MONTHLY") {
          const days = monthDays?.split(",");
          updateData("byDay", days);
        } else if (type === "YEARLY") {
          updateData("byDay", selectedMonths);
        }
      }
      updateData("type", type);
    }
    // save end settings
    if (endSetting > 0) {
      if (endSetting === 1) {
        updateData("endDate", new Date(end));
      } else {
        updateData("end", Number(endCount));
      }
    }
    updateData("freq", Number(recFreq || "1"));
    updateData("endType", endSetting);
    updateData("fromLastCompletion", Boolean(repeat));
    return data as RecurrenceInfo;
  };

  return (
    <ThemedView style={styles.colContainer}>
      <RadioButton
        selected={selectedRecurrence}
        setSelected={() => setSelectedRecurrence(0)}
        index={0}
      >
        <ThemedText>Don't Repeat</ThemedText>
      </RadioButton>
      <RadioButton
        selected={selectedRecurrence}
        setSelected={() => setSelectedRecurrence(1)}
        index={1}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText>Every </ThemedText>
          <ThemedSmallTextInput
            text={recFreq}
            placeholder="1"
            onChangeText={(text) => {
              const numeric = text.replace(/[^0-9]/g, ""); // removes anything not 0–9
              setRecFreq(numeric);
            }}
          />
          <DropdownMenu
            options={recTypeOptions}
            setSelected={(newRecType: number) => {
              setRecType(recTypeOptions[newRecType]);
            }}
            selected={recType}
          ></DropdownMenu>
        </ThemedView>
        {recType === "Weeks" && (
          <ThemedView style={[styles.titleContainer, { marginTop: 8 }]}>
            {weekdays.map((day, index) => (
              <Checkbox
                onValueChange={() => {
                  if (selectedWeekdays.includes(day)) {
                    setSelectedWeekdays((prev) =>
                      prev.filter((item) => item !== day)
                    );
                  } else {
                    setSelectedWeekdays((prev) => [...prev, day]);
                  }
                }}
                value={selectedWeekdays.includes(day)}
                key={index}
              >
                {day}
              </Checkbox>
            ))}
          </ThemedView>
        )}
        {recType === "Months" ||
          (recType === "Years" && (
            <ThemedView style={styles.titleContainer}>
              <ThemedText>Days of the Month: </ThemedText>
              <ThemedSmallTextInput
                text={monthDays}
                onChangeText={(text) => {
                  const numeric = text.replace(/[^0-9,]/g, ""); // removes anything not 0–9 or ,
                  setMonthDays(numeric);
                }}
                placeholder="ex: 4,12,7"
              />
            </ThemedView>
          ))}
        {recType === "Years" && (
          <ThemedView style={[styles.titleContainer, { marginTop: 8 }]}>
            {months.map((day, index) => (
              <Checkbox
                onValueChange={() => {
                  const updated = [...selectedMonths];
                  updated[index] = !updated[index];
                  setSelectedMonths(updated);
                }}
                value={selectedMonths[index]}
                key={index}
              >
                <ThemedText>{day}</ThemedText>
              </Checkbox>
            ))}
          </ThemedView>
        )}
      </RadioButton>
      <RadioButton
        selected={selectedRecurrence}
        setSelected={() => setSelectedRecurrence(2)}
        index={2}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText>On the</ThemedText>
          <DropdownMenu
            options={dayOfMonthOptions}
            setSelected={(newRecType: number) => {
              setDayOfMonth(dayOfMonthOptions[newRecType]);
            }}
            selected={dayOfMonth}
          />
          <DropdownMenu
            options={weekdays}
            setSelected={(newRecType: number) => {
              setSelectedWeekdays([weekdays[newRecType]]);
            }}
            selected={selectedWeekdays[0]}
          />
          <ThemedText>every</ThemedText>
          <ThemedSmallTextInput
            text={recFreq}
            onChangeText={(text) => {
              const numeric = text.replace(/[^0-9]/g, ""); // removes anything not 0–9 or ,
              setRecFreq(numeric);
            }}
            placeholder="1"
          />
          <ThemedText> months</ThemedText>
        </ThemedView>
      </RadioButton>
      <ThemedView style={styles.titleContainer}>
        <ThemedText>Repeat on next day after... </ThemedText>
        <RadioButton
          selected={repeat}
          setSelected={() => setRepeat(1)}
          index={1}
        >
          <ThemedText>the most recent completion</ThemedText>
        </RadioButton>
        <RadioButton
          selected={repeat}
          setSelected={() => setRepeat(0)}
          index={0}
        >
          <ThemedText>the previous due date</ThemedText>
        </RadioButton>
      </ThemedView>
      <ThemedView>
        <ThemedText>END</ThemedText>
        <RadioButton
          selected={endSetting}
          setSelected={() => setendSetting(0)}
          index={0}
        >
          <ThemedText>Never End</ThemedText>
        </RadioButton>
        <RadioButton
          selected={endSetting}
          setSelected={() => setendSetting(1)}
          index={1}
        >
          <ThemedView style={styles.titleContainer}>
            <ThemedText>End on date: </ThemedText>
            <ThemedButton
              onPress={() => showMode("date", end, onChangeEnd)}
              text={new Date(end).toLocaleDateString()}
            />
          </ThemedView>
        </RadioButton>
        <RadioButton
          selected={endSetting}
          setSelected={() => setendSetting(2)}
          index={2}
        >
          <ThemedView style={styles.titleContainer}>
            <ThemedText>End after </ThemedText>
            <ThemedSmallTextInput
              text={endCount}
              placeholder="1"
              onChangeText={(text) => {
                const numeric = text.replace(/[^0-9]/g, ""); // removes anything not 0–9
                setEndCount(numeric);
              }}
            />
            <ThemedText> repeats</ThemedText>
          </ThemedView>
        </RadioButton>
      </ThemedView>
    </ThemedView>
  );
});
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    width: "90%",
  },
  colContainer: {
    gap: 8,
    flexDirection: "column",
  },
});

export default RecurrenceBlock;
