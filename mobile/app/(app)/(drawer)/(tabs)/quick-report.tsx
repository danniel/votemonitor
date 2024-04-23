import React, { useState } from "react";
import { Typography } from "../../../../components/Typography";
import { View, YStack } from "tamagui";
import { Icon } from "../../../../components/Icon";
import { Screen } from "../../../../components/Screen";
import { useNavigation } from "expo-router";
import Header from "../../../../components/Header";
import { DrawerActions } from "@react-navigation/native";
import { OptionsSheet } from "../../polling-station-questionnaire";
import Button from "../../../../components/Button";

const QuickReport = () => {
  const navigation = useNavigation();
  const [openContextualMenu, setOpenContextualMenu] = useState(false);

  return (
    <Screen
      preset="auto"
      ScrollViewProps={{
        bounces: false,
      }}
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <Header
        title={"Quick Report"}
        titleColor="white"
        barStyle="light-content"
        leftIcon={<Icon icon="menuAlt2" color="white" />}
        onLeftPress={() => navigation.dispatch(DrawerActions.openDrawer)}
        rightIcon={<Icon icon="dotsVertical" color="white" />}
        onRightPress={() => {
          setOpenContextualMenu(true);
        }}
      />

      {/* <YStack flex={1} alignItems="center" justifyContent="center" gap="$md">
        <Icon icon="loadingScreenDevice" size={190} />

        <YStack gap="$xs" paddingHorizontal="$lg">
          <Typography preset="subheading" textAlign="center">
            Quick Reports
          </Typography>
          <Typography preset="body1" textAlign="center" color="$gray12">
            Here you'll be able to submit quick reports. Stay tuned! 👀
          </Typography>
        </YStack>
      </YStack> */}

      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        gap="$md"
        // paddingHorizontal="$xl"
      >
        <Icon icon="undrawFlag" />
        <YStack gap="$xs" paddingHorizontal="$lg" backgroundColor={"red"}>
          <Typography preset="body1" textAlign="center" color="$gray12" lineHeight={24}>
            Start sending quick reports to the organization if you notice irregularities inside,
            outside the polling station or whenever needed.
          </Typography>
        </YStack>
        <Button preset="outlined" width="100%">
          Report new issue
        </Button>
      </YStack>

      <OptionsSheet open={openContextualMenu} setOpen={setOpenContextualMenu}>
        {/* //TODO: what do we need to add here? */}
        <OptionsSheetContent />
      </OptionsSheet>
    </Screen>
  );
};

const OptionsSheetContent = () => {
  return (
    <View paddingVertical="$xxs" paddingHorizontal="$sm">
      <Typography preset="body1" color="$gray7" lineHeight={24}>
        Option
      </Typography>
    </View>
  );
};

export default QuickReport;
