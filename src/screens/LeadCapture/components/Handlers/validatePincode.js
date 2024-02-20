import { OnSubmitLead } from './onSubmit';

export const validatePincode = async (
  data,
  setId,
  id,
  teamHeirarchyByUserId,
  pincodeMasterData,
  dsaBrJnData,
  empRole,
  isOnline,
  setPostData,
  userBranch,
  userLocation,
  alertVisible,
  setAlertVisible,
  setAddLoading
) => {
  try {
    console.log('Validate Pincode');
    // Check if userLocation is falsy
    if (!userLocation) {
      setAlertVisible({
        visible: true,
        title: `Please enter a Serviceable Pincode.`,
        confirmBtnLabel: 'OK',
        onClickYes: () => setAlertVisible({ ...alertVisible, visible: false }),
        ionIconName: 'information-circle',
      });
      return;
    }

    // Use a Set for faster lookup of PIN codes
    const pincodeSet = new Set(pincodeMasterData.map((pin) => pin.PIN__c));

    console.log('Pincode Set', pincodeSet);

    // Check if the user's PIN code exists in the set
    if (!pincodeSet.has(data?.Pincode__c)) {
      setAlertVisible({
        visible: true,
        title: `Please enter a Serviceable Pincode.`,
        confirmBtnLabel: 'OK',
        onClickYes: () => setAlertVisible({ ...alertVisible, visible: false }),
        ionIconName: 'information-circle',
      });
      return;
    } else {
      let pinData = pincodeMasterData.find(
        (pin) =>
          pin.PIN__c === data?.Pincode__c &&
          userLocation.Location__c === pin?.City__c
      );
      // Check if the user's location city matches the PIN code location
      if (!pinData) {
        let getPin = pincodeMasterData.find(
          (p) => p.PIN__c === data?.Pincode__c
        );
        setAlertVisible({
          visible: true,
          title: `Pincode of ${
            getPin?.State__c || 'unknown'
          } state entered. Kindly check the Pincode entered.`,
          confirmBtnLabel: 'Confirm',
          cancelBtnLabel: 'Cancel',
          onDismiss: () => {
            setAlertVisible({ ...alertVisible, visible: false });
          },
          onClickYes: async () => {
            await OnSubmitLead(
              data,
              setId,
              id,
              teamHeirarchyByUserId,
              dsaBrJnData,
              empRole,
              isOnline,
              setPostData,
              userBranch
            );

            setAlertVisible({ ...alertVisible, visible: false });
          },
          ionIconName: 'information-circle',
        });
        return;
      }
      await OnSubmitLead(
        data,
        setId,
        id,
        teamHeirarchyByUserId,
        dsaBrJnData,
        empRole,
        isOnline,
        setPostData,
        userBranch
      );

      return;
    }
  } catch (error) {
    console.error('Error in validatePincode:', error);
  }
};
