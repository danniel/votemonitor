import React, { Dispatch, SetStateAction } from "react";
import { XStack, YStack } from "tamagui";
import { Typography } from "./Typography";
import Button from "./Button";
import { Controller, useForm } from "react-hook-form";
import Input from "./Inputs/Input";
import { useAddNoteMutation } from "../services/mutations/add-note.mutation";
import { Keyboard, Platform } from "react-native";
import * as Crypto from "expo-crypto";
import { useTranslation } from "react-i18next";
import { useKeyboardVisible } from "@tamagui/use-keyboard-visible";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AddNoteSheetContent = ({
  setAddingNote,
  pollingStationId,
  formId,
  questionId,
  electionRoundId = "",
  setIsOptionsSheetOpen,
}: {
  setAddingNote: Dispatch<SetStateAction<boolean>>;
  pollingStationId: string;
  formId: string;
  questionId: string;
  electionRoundId: string | undefined;
  setIsOptionsSheetOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation("bottom_sheets");
  const insets = useSafeAreaInsets();
  const keyboardIsVisible = useKeyboardVisible();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      noteText: "",
    },
  });

  const { mutate: addNote } = useAddNoteMutation(
    electionRoundId,
    pollingStationId,
    formId,
    `Note_${electionRoundId}_${pollingStationId}_${formId}_${questionId}`,
  );

  const onSubmitNote = (note: { noteText: string }) => {
    const notePayload = {
      id: Crypto.randomUUID(),
      pollingStationId,
      text: note.noteText,
      formId,
      questionId,
    };

    addNote({ electionRoundId, ...notePayload });
    Keyboard.dismiss();
    setIsOptionsSheetOpen(false);
    setAddingNote(false);
    reset();
  };

  return (
    <YStack
      marginHorizontal={12}
      gap="$md"
      paddingBottom={
        // add padding if keyboard is visible
        Platform.OS === "ios" && keyboardIsVisible && Keyboard.metrics()?.height
          ? // @ts-ignore: it will not be undefined because we're checking above
            Keyboard.metrics()?.height - insets.bottom
          : 0
      }
    >
      <Typography preset="heading">{t("add_note.title")}</Typography>

      <Controller
        key={questionId + "_note"}
        name={"noteText"}
        control={control}
        rules={{
          maxLength: {
            value: 10000,
            message: t("add_note.errors.note_input"),
          },
        }}
        render={({ field: { value: noteValue, onChange: onNoteChange } }) => {
          return (
            <YStack height={150}>
              <Input
                type="textarea"
                placeholder={t("add_note.placeholder")}
                value={noteValue}
                height={150}
                onChangeText={onNoteChange}
              />
            </YStack>
          );
        }}
      />
      {errors.noteText && <Typography color="$red12">{errors.noteText.message}</Typography>}
      <XStack gap="$md">
        <Button preset="chromeless" onPress={() => setAddingNote(false)}>
          {t("add_note.actions.cancel")}
        </Button>
        <Button flex={1} onPress={handleSubmit(onSubmitNote)}>
          {t("add_note.actions.save")}
        </Button>
      </XStack>
    </YStack>
  );
};

export default AddNoteSheetContent;
