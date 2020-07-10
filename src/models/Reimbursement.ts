export class Reimbursement{
    reimbursementId: number // primary key
    author: number  // foreign key -> User, not null
    amount: number  // not null
    dateSubmitted: bigint // not null
    dateResolved: bigint // not null
    description: string // not null
    resolver: number // foreign key -> User
    status: number // foreign ey -> ReimbursementStatus, not null
    type: number // foreign key -> ReimbursementType
  }