<?php

function combinations($arrays, $i = 0) {
    if (!isset($arrays[$i])) {
        return array();
    }
    if ($i == count($arrays) - 1) {
        print_r($arrays[$i]);
        print_r($i);
        return $arrays[$i];
    }

    // get combinations from subsequent arrays
    $tmp = combinations($arrays, $i + 1);

    print_r($tmp);

    $result = array();

    // concat each array from tmp with each element from $arrays[$i]
    foreach ($arrays[$i] as $v) {
        foreach ($tmp as $t) {
            $result[] = is_array($t) ? 
                array_merge(array($v), $t) :
                array($v, $t);
        }
    }

    return $result;
}

print_r(
    combinations(
        array(
            array('A1','A2','A3'), 
            array('B1','B2','B3'), 
            array('C1','C2')
        )
    )
);