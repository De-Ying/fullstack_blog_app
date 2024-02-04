import PropTypes from "prop-types";

const NoDataMessage = ({ message }) => {

    return (
        <div className="text-center w-full p-4 rounded-full bg-grey/50 mt-4">
            { message }
        </div>
    )
}

NoDataMessage.propTypes = {
    message: PropTypes.string,
};

export default NoDataMessage;