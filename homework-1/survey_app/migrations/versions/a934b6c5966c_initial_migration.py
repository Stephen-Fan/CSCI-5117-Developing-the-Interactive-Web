"""Initial migration

Revision ID: a934b6c5966c
Revises: 
Create Date: 2024-09-26 20:43:27.866612

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'a934b6c5966c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('survey_responses',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=50), nullable=False),
    sa.Column('last_name', sa.String(length=50), nullable=False),
    sa.Column('radio_option', sa.String(length=50), nullable=False),
    sa.Column('select_option', sa.String(length=50), nullable=False),
    sa.Column('checkbox_value', sa.Boolean(), nullable=False),
    sa.Column('optional_text', sa.String(length=500), nullable=True),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('survey_response')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('survey_response',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('first_name', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('last_name', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('radio_option', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('select_option', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('checkbox_value', sa.BOOLEAN(), autoincrement=False, nullable=False),
    sa.Column('optional_text', sa.VARCHAR(length=500), autoincrement=False, nullable=True),
    sa.Column('timestamp', postgresql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='survey_response_pkey')
    )
    op.drop_table('survey_responses')
    # ### end Alembic commands ###