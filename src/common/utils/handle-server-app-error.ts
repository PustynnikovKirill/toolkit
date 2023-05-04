import { Dispatch } from 'redux';
import { appActions } from 'app/app.reducer';
import { ResponseType } from 'common/types/common.types';

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch,showError:boolean=true) => {

	if (showError) {
		dispatch(appActions.setAppError(data.messages.length ? {error: data.messages[0]}:{error: 'Some error occurred'}))
	}

}
