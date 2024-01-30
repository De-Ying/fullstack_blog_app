import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { EditorContext } from '../pages/editor.pages';
import ContentEditable from 'react-contenteditable';

const Tag = ({ tag, tagIndex }) => {

    const { blog, setBlog } = useContext(EditorContext);
    const [isEditing, setIsEditing] = useState(false);

    const handleStartEditing = () => {
        setIsEditing(true);
    };

    const handleTagEdit = (e) => {
        if (e.keyCode === 13 || e.keyCode === 188) {
            e.preventDefault();
            const updatedTags = [...blog.tags];
            updatedTags[tagIndex] = e.target.innerHTML;
            setBlog({ ...blog, tags: updatedTags });
            setIsEditing(false);
        }
    }

    const handleTagDelete = () => {
        const updatedTags = blog.tags.filter((t, index) => index !== tagIndex);
        setBlog({ ...blog, tags: updatedTags });
    }

    return (
        <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-9">
            <ContentEditable
                html={tag}
                onKeyDown={handleTagEdit}
                onClick={handleStartEditing}
                tagName="p"
                disabled={!isEditing}
            />
            <button
                className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"  
                onClick={handleTagDelete}  
            >
                <i className="fi fi-br-cross text-sm pointer-events-none"></i>
            </button>
        </div>
    )
}

Tag.propTypes = {
    tag: PropTypes.string,
    tagIndex: PropTypes.number
};

export default Tag;