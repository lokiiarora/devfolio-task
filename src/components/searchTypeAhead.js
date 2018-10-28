import React from 'react';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import searchAPI from '../utils/apiSearch';


class SearchInput extends React.Component {
    state = {
        isLoading: false,
        options:[],
        input: "",
        searched: false
    };

    _onSearch(query){
        this.setState({
            isLoading: true
        }, () => {
            searchAPI(query).then(({items}) => {
                this.setState({
                    isLoading:false,
                    options:items,
                    searched: true
                });
            })
        })
    }

    focus() {
        this.inputEle.getInstance().focus();
    }

    _onChange(e) {
        this.setState({
            input:e[0].name
        });
    }

    registerTag() {
        const {input, searched} = this.state;
        if(searched) {
            console.log("This is supposed to be registered now", input);
            this.props.onAdd(input);
        }
    }


    render() {
        return (
            <AsyncTypeahead ref={ref => this.inputEle = ref} minLength={3} onChange={e => this._onChange(e)} options={this.state.options} isLoading={this.state.isLoading} renderMenuItemChildren={(option, props) => {
                return (
                    <p key={option.name}>{option.name}</p>
                );
            }} labelKey="name" onBlur={e => this.registerTag()} placeholder={"Search for a skill.."} onSearch={query => this._onSearch(query)}></AsyncTypeahead>
        );
    }
}

export default SearchInput;