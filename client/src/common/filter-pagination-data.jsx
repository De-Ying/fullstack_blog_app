import axios from "axios";

export const filterPaginationData = async ({
  create_new_array = false,
  state,
  data,
  page,
  countRoute,
  data_to_send = { },
}) => {
  let obj;

  try {
    if (state !== null && !create_new_array) {
      obj = { ...state, results: [...state.results, ...data], page: page };
    } else {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_API + countRoute,
        data_to_send
      );

      const { totalDocs } = response.data;
      obj = { results: data, page: 1, totalDocs };
    }
  } catch (err) {
    console.log(err);
    // Ensure obj is defined even in case of error
    obj = { results: [], page: 1, totalDocs: 0 };
  }

  return obj;
};
