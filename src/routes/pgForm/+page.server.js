import { fail } from '@sveltejs/kit';

const sharingRoomTypes = [
    'sharing1Rooms',
    'sharing2Rooms',
    'sharing3Rooms',
    'sharing4Rooms',
    'sharing5Rooms'
  ];

async function prepareFormData(request) {
  const formData = await request.formData();
  let amenities = [];

   for (const key of sharingRoomTypes) {
    const rooms = JSON.parse(formData.get(key));
    if (rooms?.length > 0) {
      const sortedRooms = rooms.sort((a, b) => Number(a) - Number(b));
      formData.delete(key);
      formData.set(key, JSON.stringify(sortedRooms));
    }
  }
  console.log('formData', formData);

  for (const [key, value] of formData.entries()) {
    if (key === 'pgAmenities') {
      amenities.push(value);
    }
    if (sharingRoomTypes.includes(key)) {
      const availableRooms = JSON.parse(value).reduce((acc, curr) => {
        acc[curr] = Number(key.substring(7,8));
        return acc;
      }, {});
      // const availableRooms = new Map(
      //   JSON.parse(value).map(curr => [curr, 1])
      // );
      formData.set(key.replace("Rooms","AvailableRooms"), JSON.stringify(availableRooms));
    }
  }
  formData.delete('pgAmenities');
  formData.append('pgAmenities', JSON.stringify(amenities));
  const selectedState = JSON.parse(formData.get('pgState'));
  const selectedPgType = JSON.parse(formData.get('pgType'));
  formData.set('pgState', selectedState.value);
  formData.set('pgType', selectedPgType.value);
  return formData;
}

export const actions = {
  createInventory: async ({ request, locals }) => {
    const formData = await prepareFormData(request);
    if (formData.get('pgRefundableDeposit') > formData.get('pgDepositAmount')) {
      return fail(400, { errors: { pgRefundableDeposit : { message : "refundable amount cannot be greater than deposite" }}});
    }
    try {
      const record = await locals.pb.collection("pgProperties").create(formData);
      let pgPropertyIdsList = locals.user.pgPropertyId || [];
      pgPropertyIdsList.push(record.id);
      await locals.pb.collection('users').update(locals.user.id, { isOwner : true, pgPropertyId : pgPropertyIdsList });
      return { propertyCreated : 'your property details have been saved successfully you can veiw it once the verification of the property is done'};
    } catch (error) {
      console.error("Failed to create record:",error.response?.data);
      return fail(400, { errors: error.response?.data });
    }
  },

  updateInventory: async ({ request, url, locals }) => {
    const formData = await prepareFormData(request);
    if (formData.get('pgRefundableDeposit') > formData.get('pgDepositAmount')) {
      return fail(400, { errors: { pgRefundableDeposit : { message : "refundable amount cannot be greater than deposite" }}});
    }
    try {
      const record = await locals.pb.collection("pgProperties").update(url.searchParams.get("recordId"), formData);
      console.log("Record updated:", record);
      return { propertyUpdated : 'your property details have been updated successfully'};
    } catch (error) {
      console.error("Failed to update record:",error.response?.data);
      return fail(400, { errors: error.response?.data });
    }
  }
};


