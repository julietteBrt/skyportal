import os
import pandas as pd
import time
from regions import Regions

import uuid
from skyportal.tests import api


def test_token_user_post_get_instrument(super_admin_token):
    name = str(uuid.uuid4())
    status, data = api(
        'POST',
        'telescope',
        data={
            'name': name,
            'nickname': name,
            'lat': 0.0,
            'lon': 0.0,
            'elevation': 0.0,
            'diameter': 10.0,
        },
        token=super_admin_token,
    )
    assert status == 200
    assert data['status'] == 'success'
    telescope_id = data['data']['id']

    fielddatafile = f'{os.path.dirname(__file__)}/../../../data/ZTF_Fields.csv'
    regionsdatafile = f'{os.path.dirname(__file__)}/../../../data/ZTF_Region.reg'

    instrument_name = str(uuid.uuid4())
    status, data = api(
        'POST',
        'instrument',
        data={
            'name': instrument_name,
            'type': 'imager',
            'band': 'NIR',
            'filters': ['f110w'],
            'telescope_id': telescope_id,
            'field_data': pd.read_csv(fielddatafile)[:5].to_dict(orient='list'),
            'field_region': Regions.read(regionsdatafile).serialize(format='ds9'),
        },
        token=super_admin_token,
    )
    assert status == 200
    assert data['status'] == 'success'

    # wait for the fields to populate
    time.sleep(15)

    instrument_id = data['data']['id']
    status, data = api('GET', f'instrument/{instrument_id}', token=super_admin_token)
    assert status == 200
    assert data['status'] == 'success'
    assert data['data']['band'] == 'NIR'

    assert len(data['data']['fields']) == 5

    assert any(
        [
            d['field_id'] == 1
            and d['contour']['properties']['ra'] == 0.0
            and d['contour']['properties']['dec'] == -89.05
            for d in data['data']['fields']
        ]
    )


def test_fetch_instrument_by_name(super_admin_token):
    tel_name = str(uuid.uuid4())
    status, data = api(
        'POST',
        'telescope',
        data={
            'name': tel_name,
            'nickname': tel_name,
            'lat': 0.0,
            'lon': 0.0,
            'elevation': 0.0,
            'diameter': 10.0,
        },
        token=super_admin_token,
    )
    assert status == 200
    assert data['status'] == 'success'
    telescope_id = data['data']['id']

    instrument_name = str(uuid.uuid4())
    status, data = api(
        'POST',
        'instrument',
        data={
            'name': instrument_name,
            'type': 'imager',
            'band': 'V',
            'telescope_id': telescope_id,
        },
        token=super_admin_token,
    )
    assert status == 200
    assert data['status'] == 'success'

    instrument_id = data['data']['id']
    status, data = api(
        'GET', f'instrument?name={instrument_name}', token=super_admin_token
    )
    assert status == 200
    assert data['status'] == 'success'
    assert len(data['data']) == 1
    assert data['data'][0]['band'] == 'V'
    assert data['data'][0]['id'] == instrument_id
    assert data['data'][0]['name'] == instrument_name


def test_token_user_update_instrument(
    super_admin_token, manage_sources_token, view_only_token
):
    name = str(uuid.uuid4())
    status, data = api(
        'POST',
        'telescope',
        data={
            'name': name,
            'nickname': name,
            'lat': 0.0,
            'lon': 0.0,
            'elevation': 0.0,
            'diameter': 10.0,
        },
        token=super_admin_token,
    )
    assert status == 200
    assert data['status'] == 'success'
    telescope_id = data['data']['id']

    instrument_name = str(uuid.uuid4())
    status, data = api(
        'POST',
        'instrument',
        data={
            'name': instrument_name,
            'type': 'imager',
            'band': 'NIR',
            'filters': ['f110w'],
            'telescope_id': telescope_id,
        },
        token=super_admin_token,
    )
    assert status == 200
    assert data['status'] == 'success'

    instrument_id = data['data']['id']
    status, data = api('GET', f'instrument/{instrument_id}', token=super_admin_token)
    assert status == 200
    assert data['status'] == 'success'
    assert data['data']['band'] == 'NIR'

    new_name = f'Gattini2_{uuid.uuid4()}'

    status, data = api(
        'PUT',
        f'instrument/{instrument_id}',
        data={
            'name': new_name,
            'type': 'imager',
            'band': 'NIR',
            'filters': ['f110w'],
            'telescope_id': telescope_id,
        },
        token=manage_sources_token,
    )
    assert status == 400
    assert data['status'] == 'error'

    status, data = api(
        'PUT',
        f'instrument/{instrument_id}',
        data={
            'name': new_name,
            'type': 'imager',
            'band': 'NIR',
            'filters': ['f110w'],
            'telescope_id': telescope_id,
        },
        token=super_admin_token,
    )
    assert status == 200
    assert data['status'] == 'success'

    status, data = api('GET', f'instrument/{instrument_id}', token=view_only_token)
    assert status == 200
    assert data['status'] == 'success'
    assert data['data']['name'] == new_name


def test_token_user_delete_instrument(super_admin_token, view_only_token):
    name = str(uuid.uuid4())
    status, data = api(
        'POST',
        'telescope',
        data={
            'name': name,
            'nickname': name,
            'lat': 0.0,
            'lon': 0.0,
            'elevation': 0.0,
            'diameter': 10.0,
        },
        token=super_admin_token,
    )
    assert status == 200
    assert data['status'] == 'success'
    telescope_id = data['data']['id']

    instrument_name = str(uuid.uuid4())
    status, data = api(
        'POST',
        'instrument',
        data={
            'name': instrument_name,
            'type': 'imager',
            'band': 'NIR',
            'filters': ['f110w'],
            'telescope_id': telescope_id,
        },
        token=super_admin_token,
    )

    assert status == 200
    assert data['status'] == 'success'
    instrument_id = data['data']['id']

    status, data = api('DELETE', f'instrument/{instrument_id}', token=super_admin_token)
    assert status == 200
    assert data['status'] == 'success'

    status, data = api('GET', f'instrument/{instrument_id}', token=view_only_token)
    assert status == 400
