import { Sheet, View } from "tamagui";
import { Icon } from "../../../components/Icon";
import { Typography } from "../../../components/Typography";

export const CustomSheet = ({ open, onClose }: { open: boolean; onClose: any }) => {
  // const [open, setOpen] = useState(false);
  console.log("Open:" + open);
  return (
    <>
      <Sheet
        open={open}
        onOpenChange={onClose}
        snapPointsMode="fit"
        modal={true}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />

        <Sheet.Frame borderRadius={28} gap={12} paddingHorizontal={16} paddingBottom={32}>
          <Icon paddingVertical={16} alignSelf="center" icon="dragHandle"></Icon>

          <View paddingVertical={8} paddingHorizontal={12}>
            <Typography preset="body1" color="$gray7" lineHeight={24}>
              Clear form (delete all answers)
            </Typography>
          </View>
        </Sheet.Frame>
      </Sheet>
    </>
  );
};
