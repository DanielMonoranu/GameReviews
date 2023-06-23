import { Form, Formik, FormikHelpers } from "formik";
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { developerDTO } from '../Developers/developers.model';
import CheckboxField from '../Forms/CheckboxField';
import DateField from '../Forms/DateField';
import ImageField from '../Forms/ImageField';
import MultipleSelectField from '../Forms/MultiSelectField';
import QuillField, { multipleSelectModel } from '../Forms/QuillField';
import TextField from '../Forms/TextField';
import { genreDTO } from '../Genres/genres.model';
import { platformDTO } from '../Platforms/platforms.model';
import { gameCreationDTO } from "./games.model";

export default function GameForm(props: gameFormProps) {
    function mapToViewModel(items: { id: number, name: string }[]): multipleSelectModel[] {
        return items.map(item => { return { key: item.id, value: item.name } });
    }

    return (
        <Formik initialValues={props.model}
            onSubmit={(values, actions) => {
                props.onSubmit(values, actions);
            }}
            validationSchema={Yup.object({
                name: Yup.string().required("This field is required").firstLetterUpercase(),
                trailer: Yup.string().required("This field is required").url("Trailer must be a valid URL"),
            })
            }
        >
            {(formikProps) => (
                <Form>
                    <TextField field="name" labelName="Name"></TextField>
                    <CheckboxField displayName='Multiplayer' field='multiplayer' />
                    <TextField field="trailer" labelName="Trailer"></TextField>
                    <DateField field="releaseDate" displayName="Release Date:"></DateField>
                    <ImageField field='poster' displayName='Poster' imageURL={props.model.posterURL} />

                    <QuillField field='description' displayName='Description' default={props.model.description} />

                    <MultipleSelectField
                        allOptions={mapToViewModel(props.allGenres)}
                        selectedOptions={mapToViewModel(props.selectedGenres)}
                        displayName='Genres'
                        field='genresIDs'
                    />
                    <MultipleSelectField
                        allOptions={mapToViewModel(props.allDevelopers)}
                        selectedOptions={mapToViewModel(props.selectedDevelopers)}
                        displayName='Developer'
                        field='developerID'
                        singleSelect={true}
                    />
                    <MultipleSelectField
                        allOptions={mapToViewModel(props.allPlaforms)}
                        selectedOptions={mapToViewModel(props.selectedPlatforms)}
                        displayName='Platforms'
                        field='platformsIDs'
                    />
                    <button disabled={formikProps.values.name === '' || !formikProps.isValid} type="submit" style={{ backgroundColor: "#7A82FF", border: "#7A82FF", marginBottom: '20px' }} className="btn btn-primary" >Save Changes</button>
                    <Link className="btn btn-secondary" to="/genres" style={{ marginRight: '25px', backgroundColor: "#DC3545", border: "#DC3545", marginBottom: '20px' }}  >Cancel</Link>
                </Form>)}
        </Formik >
    )
}
interface gameFormProps {
    model: gameCreationDTO;
    onSubmit(values: gameCreationDTO, action: FormikHelpers<gameCreationDTO>): void;
    selectedGenres: genreDTO[];
    allGenres: genreDTO[];
    selectedDevelopers: developerDTO[];
    allDevelopers: developerDTO[];
    selectedPlatforms: platformDTO[];
    allPlaforms: platformDTO[];

}