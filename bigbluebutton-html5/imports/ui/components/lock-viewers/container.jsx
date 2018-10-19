import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withModalMounter } from '/imports/ui/components/modal/service';
import LockViewersComponent from './component';
import Service from './service';

const LockViewersContainer = props => <LockViewersComponent {...props} />;

export default withModalMounter(withTracker(({ mountModal }) => {

    return ({
        closeModal: () => {
            if (!Service.isConnecting()) mountModal(null);
        }
    });
})(LockViewersContainer));
