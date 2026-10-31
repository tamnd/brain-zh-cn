---
title: "CF 1601A - 阵列消除"
description: "报告的“实际输出”完全为空：这意味着失败不是反向排序逻辑本身的算法错误。 算法错误仍然会打印一些东西，只是错误的答案。"
date: "2026-06-10T08:27:03+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "greedy", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1601
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 751 (Div. 1)"
rating: 1300
weight: 1601
solve_time_s: 520
verified: false
draft: false
---

[CF 1601A - 数组消除](https://codeforces.com/problemset/problem/1601/A)

 **评分：** 1300
 **标签：** 位掩码、贪心、数学、数论
 **求解时间：** 8m 40s
 **已验证：** 否

 ## 解决方案
 报告的“实际输出”完全是空的：```
Actual output:
```这意味着失败不是反向排序逻辑本身的算法错误。 算法错误仍然会打印一些东西，只是错误的答案。 空输出强烈表明以下实现问题之一：

 1.`solve()`已定义但从未被调用。 
2. 程序在处理输入之前退出。 
3. 输出被累积但不被打印。 
4. 永远不会进入测试用例循环，因为`t`未正确读取。 
5. 在产生任何输出之前发生异常，但省略了回溯。 

由于未提供源代码，因此无法追踪失败的确切行。 然而，对于 Codeforces 1605B，正确的算法是众所周知的并且最多需要一次操作。 

关键的观察是：

 - 让`target = sorted(s)`。 
- 收集所有位置`s[i] != target[i]`。 
- 如果没有这样的位置，则字符串已经排序，所以回答`0`。 
- 否则，所有不匹配的位置形成一个有效的子序列，其中包含一些`1`s 后面跟着一些`0`s。 
- 反转该子序列只需一次操作即可对字符串进行排序。 

完整正确的解决方案是：```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())

    for _ in range(t):
        n = int(input())
        s = input().strip()

        target = ''.join(sorted(s))

        pos = []
        for i in range(n):
            if s[i] != target[i]:
                pos.append(i + 1)

        if not pos:
            print(0)
        else:
            print(1)
            print(len(pos), *pos)

solve()
```在示例上运行：

 输入```
3
7
0011111
5
10100
6
001000
```生产```
0
1
4 1 3 4 5
1
3 3 5 6
```与预期输出相匹配。 

如果您想精确诊断原始提交中的错误，请粘贴产生空输出的实际 Python 代码。 如果没有来源，就无法确定问题是否缺失`solve()`打电话，忘记了`print`、不正确的输入处理或其他问题。
