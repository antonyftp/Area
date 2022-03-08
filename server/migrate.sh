#! /usr/bin/env bash

dotnet ef migrations bundle --verbose && ./efbundle --connection "Server=localhost;Port=5434;Database=master;Uid=sa;Pwd=Password-1245;"   