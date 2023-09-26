import { UserConnectionState } from "../../enums/user-connection-state.enum";


export class UserConnectionStateUpdateDTO {
    userId: string;
    state: UserConnectionState;

    constructor(
        userId: string,
        state: UserConnectionState) {
        this.userId = userId;
        this.state = state;
    }
}
