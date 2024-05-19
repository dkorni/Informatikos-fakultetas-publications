class PublicationModel {
    constructor(authors, title, journal, year, volume, doi) {
        this.authors = authors;
        this.title = title;
        this.journal = journal;
        this.year = year;
        this.volume = volume;
        this.doi = doi;
    }
}

export default PublicationModel;