export interface APIResponse {
	result: Result[];
}

export interface Result {
	MyEnergyData_MarketDocument: MyEnergyDataMarketDocument;
	success: boolean;
	errorCode: number;
	errorText: string;
	id: string;
	stackTrace?: any;
}

interface MyEnergyDataMarketDocument {
	mRID: string;
	createdDateTime: string;
	'sender_MarketParticipant.name': string;
	'sender_MarketParticipant.mRID': SenderMarketParticipantmRID;
	'period.timeInterval': PeriodtimeInterval;
	TimeSeries: TimeSery[];
}

interface TimeSery {
	mRID: string;
	businessType: string;
	curveType: string;
	'measurement_Unit.name': string;
	MarketEvaluationPoint: MarketEvaluationPoint;
	Period: Period[];
}

interface Period {
	resolution: string;
	timeInterval: PeriodtimeInterval;
	Point: Point[];
}

interface Point {
	position: string;
	'out_Quantity.quantity': string;
	'out_Quantity.quality': string;
}

interface MarketEvaluationPoint {
	mRID: MRID;
}

interface MRID {
	codingScheme: string;
	name: string;
}

interface PeriodtimeInterval {
	start: string;
	end: string;
}

interface SenderMarketParticipantmRID {
	codingScheme?: any;
	name?: any;
}
