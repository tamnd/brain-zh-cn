---
title: "CF 103631A - \u0423\u0440\u043e\u043a \u0444\u0438\u0437\u043a\u0443\u043b\u044c\u0442\u0443\u0440\u044b"
description: "令 $X[0],X[1],dots,X[n-1]$ 为要排列的数组，并让 (42) 中的内部循环表示每个生成的排列执行一次的操作，通常是当前数组状态的访问或输出。"
date: "2026-07-02T22:28:34+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103631
codeforces_index: "A"
codeforces_contest_name: "\u0422\u0440\u0438\u0434\u0446\u0430\u0442\u044c \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u0430\u044f \u0432\u0441\u0435\u0440\u043e\u0441\u0441\u0438\u0439\u0441\u043a\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432 \u043f\u043e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0442\u0438\u043a\u0435, \u043f\u0435\u0440\u0432\u044b\u0439 \u0442\u0443\u0440"
rating: 0
weight: 103631
solve_time_s: 130
verified: false
draft: false
---

[CF 103631A - \u0423\u0440\u043e\u043a \u0444\u0438\u0437\u043a\u0443\u043b\u044c\u0442\u0443\u0440\u044b](https://codeforces.com/problemset/problem/103631/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 10s
 **已验证：** 否

 ## 解决方案
 ## 解决方案

 让$X[0],X[1],\dots,X[n-1]$是要排列的数组，并令 (42) 中的内部循环表示每个生成的排列执行一次的操作，通常是当前数组状态的访问或输出。 

堆的方法（27）通过递归控制结构生成排列，其中参数$m$表示活动前缀的大小$X[0..m-1]$。 关键的不变量是该过程产生的所有排列$X[0..m-1]$每个递归返回步骤只执行一次交换，交换仅由奇偶校验决定$m$。 

让$\mathsf{GEN}(m)$表示尺寸的过程$m$。 为了$m=1$，该过程执行与当前安排相对应的访问。 为了$m>1$，程序执行$\mathsf{GEN}(m-1)$重复地同时将有效大小减一，并且在每次调用之后执行一次交换，该交换取决于是否$m$是奇数还是偶数。 什么时候$m$是奇数，交换总是$X[0] \leftrightarrow X[m-1]$。 什么时候$m$是偶数，交换是$X[i] \leftrightarrow X[m-1]$， 在哪里$i$贯穿$0,1,\dots,m-2$按连续迭代的顺序。 

这种结构保证了每个$m!$的排列$X[0..m-1]$只生成一次，因为递归调用枚举了前缀的所有排列，并且受控交换将前缀排列到最后一个元素的所有可能位置，同时保留邻接交换结构。 

要完成MMIX程序，只需执行$\mathsf{GEN}(m)$作为带有循环变量的过程$i$，基于堆栈或寄存器的参数$m$，和一个交换例程。 选择寄存器约定，以便$rA$指向$X[0]$,$rM$持有$m$， 和$rI$是循环索引。 

(42)中引用的内循环是访问操作； 在 MMIX 中，它在完整排列可用时（即在递归下降达到之后立即）被实现为单个调用或宏$m=1$或在每个交换返回边界之后，具体取决于（42）的公式。 在 Heap 的方法中，这对应于每次完成激活时执行一次访问$\mathsf{GEN}(n)$。 

可以使用显式的大小和索引堆栈来编写 Heap 方法的完整迭代 MMIX 实现。 让我们注册$r0$店铺$n$,$r1$储存电流$m$,$r2$店铺$i$,$r3$存储基地址$X$， 和$r4$暂时用于交换。 

程序如下。```
        LOC     Data_Segment

X       OCTA    0
N       OCTA    0

        LOC     #100

Main    LDO     $0,N              % r0 = n
        SET     $1,$0            % r1 = m = n
        SET     $2,0             % i = 0

        % initialize X[0..n-1] = 0..n-1
        SET     $3,X
        SET     $4,0
InitLp  CMP     $5,$4,$0
        PBNP    $5,InitDone
        STO     $4,$3,0
        ADD     $3,$3,8
        ADD     $4,$4,1
        JMP     InitLp
InitDone

        PUSHJ   0,GEN            % call GEN(n)
        TRAP    0,Halt,0

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% GEN(m): Heap's method
% r1 = m
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

GEN     BZ      $1,Ret

        CMP     $5,$1,1
        BZ      $5,VisitOnly

        SUB     $1,$1,1
        PUSHJ   0,GEN
        ADD     $1,$1,1

        % if m is odd
        AND     $6,$1,1
        BNZ     $6,OddCase

EvenCase
        % swap X[i] and X[m-1]
        MUL     $7,$2,8
        MUL     $8,$1,8
        SUB     $8,$8,8
        LDO     $9,X,$7
        LDO     $10,X,$8
        STO     $10,X,$7
        STO     $9,X,$8

        ADD     $2,$2,1
        CMP     $5,$2,$1
        PBNP    $5,GEN
        SET     $2,0
        JMP     GEN

OddCase
        % swap X[0] and X[m-1]
        MUL     $8,$1,8
        SUB     $8,$8,8
        LDO     $9,X
        LDO     $10,X,$8
        STO     $10,X
        STO     $9,X,$8

        JMP     GEN

VisitOnly
        % inner loop in (42): visit permutation X[0..n-1]
        PUSHJ   0,Visit
        RET

Ret     RET
```正确性来自 Heap 方法 (27) 的结构，其中递归确保$\mathsf{GEN}(m-1)$耗尽前缀的所有排列，奇偶校验控制的交换确保每个大小的扩展$m$只生成一次而不会重复。 (42) 中的内部循环恰好在递归树的每个叶子上执行，对应于以下的完整排列$X[0..n-1]$。 

这样就完成了解决方案。 ∎
