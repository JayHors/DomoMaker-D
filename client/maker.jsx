const helper = require('./helper.js');

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const pubPriv = e.target.querySelector('#domoPublic').checked ? true : false;
    const _csrf = e.target.querySelector('#_csrf').value;
    console.log(pubPriv);
    if (!name || !age) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, pubPriv, _csrf }, loadDomosFromServer('/getDomos'));

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
            <label htmlFor="public">Public? </label>
            <input type="checkbox" name="public" id="domoPublic" />
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
        console.log(domo.pubPriv);
        return (
            <div className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                {domo.pubPriv === true &&
                    <h3 className="domoPubPriv">Public Domo</h3>
                }
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

const loadDomosFromServer = async (path) => {
    const response = await fetch(path);
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domo} />,
        document.getElementById('domos')
    );
}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    const publicBtn = document.getElementById('publicFeed');

    publicBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loadDomosFromServer('/publicDomos');
    });

    ReactDOM.render(
        <DomoForm csrf={data.csrfToken} />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} />,
        document.getElementById('domos')
    );

    loadDomosFromServer('/getDomos');
}

window.onload = init;