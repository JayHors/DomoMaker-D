const helper = require('./helper.js');

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError;

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!name || !age){
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, _csrf}, loadDomosFromServer);

    return false;
}

const DomoForm = (props) => {
    return (
        <form
            action="/maker"
            className="domoForm"
            name="domoForm"
            id="domoForm"
            method="POST"
            onSubmit={handleDomo}
        >
            <label htmlFor="name">Name: </label>
            <input type="text" name="name" id="domoName" placeholder="Domo name" />
            <label htmlFor="age">Age: </label>
            <input type="number" name="age" id="domoAge" placeholder="Domo age" />
            <input type="hidden" name="_csrf" id="_csrf" value={props.csrf} />
            <input type="submit" value="Make Domo" className="makeDomoSubmit" />

        </form>
    )
}

const DomoList = (props) => {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        )
    };

    const domoNodes = props.domos.map(domo => {
        return (
            <div className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age : {domo.age}</h3>
            </div>
        )
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    )
}

const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domo} />,
        document.getElementById('domos')
    );
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <DomoForm csrf={data.csrfToken} />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} />,
        document.getElementById('domos')
    );

    loadDomosFromServer();
}

window.onload = init;