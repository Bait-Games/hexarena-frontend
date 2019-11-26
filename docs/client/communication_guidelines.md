As a general guideline, the client should do as much work for the server as it can, but without compromising security.
At the same time, the amount of data that is transmitted should be kept to a minimum.

Clients SHOULD send to the server a message that their player moved in one of the 8 cardinal directions.
Clients SHOULD NOT send more than one movement message per tick
    e.g. Clients should send `UP_RIGHT`, not `UP` and `RIGHT`
         Clients should send `RIGHT`, not `RIGHT` and `RIGHT`