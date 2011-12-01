<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration,
    Doctrine\DBAL\Schema\Schema;

/**
 * Adding a column gor youtube videos
 */
class Version20111201043223 extends AbstractMigration
{
    public function up(Schema $schema)
    {
       // this up() migration is autogenerated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != "mysql");
        
        $this->addSql("ALTER TABLE offerings ADD COLUMN video_intro text");

    }

    public function down(Schema $schema)
    {
        // this down() migration is autogenerated, please modify it to your needs.
        $this->abortIf($this->connection->getDatabasePlatform()->getName() != "mysql");
        
        $this->addSql("ALTER TABLE offerings DROP COLUMN video_intro");

    }
}
