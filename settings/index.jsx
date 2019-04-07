function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Watch Settings</Text>}>
        <Toggle
          settingsKey="extraInfo"
          label="Hide Extra Info"
        />
        <ColorSelect
          settingsKey="color"
          colors={[
            {color: "white", value: "white"},
            {color: "tomato", value: "tomato"},
            {color: "sandybrown", value: "sandybrown"},
            {color: "gold", value: "gold"},
            {color: "lawngreen", value: "lawngreen"},
            {color: "deepskyblue", value: "deepskyblue"},
            {color: "plum", value: "plum"},
            {color: "grey", value: "grey"}            
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
