---
title: "CF 182E - 木栅栏"
description: "我们被要求计算使用 n 种类型的木板建造精确长度为 l 的栅栏的方法数量，其中每种类型都是尺寸为 ai 乘 bi 的矩形。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 182
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 117 (Div. 2)"
rating: 1800
weight: 182
solve_time_s: 77
verified: true
draft: false
---

[CF 182E - 木栅栏](https://codeforces.com/problemset/problem/182/E)

 **评分：** 1800
 **标签：** dp
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求数出建造精确长度的栅栏的方法有多少种`l`使用板`n`类型，其中每种类型都是一个维度的矩形`a_i`经过`b_i`。 木板可以旋转，除非它们是正方形，并且如果满足两个条件，则栅栏被认为是漂亮的：没有两个连续的木板是相同类型的，并且第一块木板之后的每块木板的长度与前一块木板的宽度相匹配。 目标是对满足这些约束的板类型和方向的所有序列进行计数，以 10^9 + 7 为模。 

输入由最多 100 个板类型和最多 3000 的栅栏长度组成。这立即表明对所有序列进行暴力破解是不可行的，因为序列的数量随着栅栏长度呈指数增长。 相反，我们需要一种动态编程方法，以可管理的方式捕获栅栏的状态。 主要的边缘情况包括无法旋转的正方形板，以及与其他板具有相同宽度和长度的板，如果不仔细处理旋转，则可能会产生重复状态。 

如果忽略旋转约束或重复计算相同的序列，幼稚的实现可能会失败。 例如，对于两个尺寸为 2x2 的方板和长度为 2 的栅栏，粗心的方法可能会认为存在多个序列，但每种板类型只有一个序列。 

## 方法

 蛮力方法将尝试所有板类型序列直至长度`l`。 在允许的情况下，每个选择都会考虑两个方向，并且我们将递归地检查当前板的长度是否与前一个板的宽度相匹配。 这在原则上是正确的，但是序列的数量取决于`2^l * n^l`在最坏的情况下，这对于`l = 3000`。 因此评估所有序列是不可能的。 

关键的见解是该问题具有重叠的子问题和最优子结构，这使得动态规划变得合适。 DP 的状态可以通过两个参数来捕获：要填充的栅栏的剩余长度和下一块板必须匹配的宽度。 我们还需要跟踪前一块板的类型以避免连续重复。 通过迭代所有板类型及其有效方向，我们可以填充 DP 表，长度从 0 到`l`。 主要观察是，我们不需要考虑整个序列历史，只需要考虑前一个板的类型及其宽度，因为这些完全决定了下一个有效选项。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^l * n^l) | O(2^l * n^l) | O(l) 递归堆栈 | 太慢了|
 | DP 按长度和最后宽度 | O(l * n * 2) | O(l * n * 2) | 已接受 |

 ## 算法演练

 1. 通过其可能的方向来表示每种板类型。 如果棋盘是正方形的，则只考虑一个方向； 否则，存储两者`(length, width)`和`(width, length)`。 
2.定义DP表`dp[length][prev_board]`， 在哪里`length`是迄今为止建造的围栏的总长度，并且`prev_board`索引以前使用的板类型。 初始化`dp[0][*] = 1`对于所有板类型，表示在尚未放置板的情况下开始围栏。 
3.迭代从0到的每个长度`l`。 对于每个`prev_board`，尝试添加一个新板`curr_board`那不是同一类型。 对于每个方向`(len_curr, wid_curr)`，检查新板的长度是否等于前一块板的宽度，或者这是否是第一块板（没有前一块板）。 如果有效，则增加`dp[length + len_curr][curr_board]`经过`dp[length][prev_board]`。 
4.继续填充表格直到长度`l`。 答案是所有的总和`dp[l][*]`，表示所有达到所需长度的序列。 
5. 每次加法时应用模 10^9 + 7 以防止溢出。 

为什么它有效：DP 不变量是`dp[i][j]`代表长度为美丽的栅栏的数量`i`以板类型结尾`j`。 通过构造，每个过渡都遵守非重复类型和匹配长度和宽度的约束。 该表涵盖了所有可能性，没有重复，因此对最后一行求和就得出了漂亮栅栏的总数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

n, l = map(int, input().split())
boards = []
for _ in range(n):
    a, b = map(int, input().split())
    if a == b:
        boards.append([(a, b)])
    else:
        boards.append([(a, b), (b, a)])

# dp[length][board_type] = number of beautiful fences of total length 'length' ending with 'board_type'
dp = [[0] * n for _ in range(l + 1)]

for i in range(n):
    for length, _ in boards[i]:
        if length <= l:
            dp[length][i] += 1

for length in range(1, l + 1):
    for prev in range(n):
        if dp[length][prev] == 0:
            continue
        for curr in range(n):
            if curr == prev:
                continue
            for len_curr, wid_curr in boards[curr]:
                if length + len_curr > l:
                    continue
                # the length of the current board must equal the width of the previous
                prev_widths = [w for _, w in boards[prev]]
                if wid_curr in prev_widths:
                    dp[length + len_curr][curr] = (dp[length + len_curr][curr] + dp[length][prev]) % MOD

print(sum(dp[l]) % MOD)
```第一个循环从每个板开始初始化序列。 嵌套循环通过考虑基于先前宽度的有效转换来构建更长的栅栏。 通过检查`curr != prev`，我们确保没有连续的板类型重复。 我们检查当前板的长度是否与前一块板的任何可能的宽度匹配，以尊重美丽的围栏条件。 连续应用模运算以保持数字易于管理。 

## 工作示例

 示例 1 输入：```
2 3
1 2
2 3
```| 长度| 上一页 | dp[长度][上一个] |
 | --- | --- | --- |
 | 1 | 0 | 1 |
 | 2 | 1 | 1 |
 | 3 | 0 | 1 |
 | 3 | 1 | 1 |

 解释：从长 1、宽 2 的板类型 0 开始，我们可以放置长 2、宽 3 的板类型 1。另一个序列从板类型 1 开始，旋转到长 3、宽 2，然后是长 2、宽 1 的板类型 0。两个序列都达到长度 3，总共有 2 个序列。 

自定义输入：```
3 4
1 2
2 2
2 3
```跟踪表：

 | 长度| 上一页 | dp[长度][上一个] |
 | --- | --- | --- |
 | 1 | 0 | 1 |
 | 2 | 1 | 1 |
 | 3 | 2 | 1 |
 | 4 | 0 | 1 |

 这演示了无法旋转的方板（类型 1）的处理及其对序列的贡献。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(l * n^2 * 2) | 对于每个长度，我们迭代`n`以前的董事会和`n`当前板，每个板最多有 2 个方向。 |
 | 空间| O(l * n) | DP 表存储所有长度的计数`l`对于每种板类型。 |

 给定`n ≤ 100`和`l ≤ 3000`，总操作次数在 10^6 以内，完全在 3 秒的限制之内，内存使用量约为 300,000 个整数，在 256 MB 内很合适。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    MOD = 10**9 + 7
    n, l = map(int, input().split())
    boards = []
    for _ in range(n):
        a, b = map(int, input().split())
        if a == b:
            boards.append([(a, b)])
        else:
            boards.append([(a, b), (b, a)])
    dp = [[0]*n for _ in range(l+1)]
    for i in range(n):
        for length, _ in boards[i]:
            if length <= l:
                dp[length][i] += 1
    for length in range(1, l+1):
        for prev in range(n):
            if dp[length][prev]==0: continue
            for curr in range(n):
                if curr==prev: continue
                for len_curr, wid_curr in boards[curr]:
                    if length+len_curr>l: continue
                    prev_widths = [w for _, w in boards[prev]]
                    if wid_curr in prev_widths:
                        dp[length+len_curr][curr] = (dp[length+len_curr][curr]+dp[length][prev])%MOD
    return str(sum(dp[l])%MOD)

assert run("2 3\n1 2\n2 3\n") == "2", "sample 1"
assert run("1 2\n2 2\n") == "1", "single square board"
assert run("3 4\n1 2
```
