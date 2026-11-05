---
title: "CF 1845C - 强密码"
description: "我们被要求确定 Monocarp 是否可以构造一个长度恰好为 m 的密码，该密码满足三个条件：每个数字必须位于两个字符串 l 和 r 的对应数字之间，密码只能使用数字 0 到 9，并且不能显示为..."
date: "2026-06-09T05:55:02+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "dp", "greedy", "strings"]
categories: ["algorithms"]
codeforces_contest: 1845
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 151 (Rated for Div. 2)"
rating: 1400
weight: 1845
solve_time_s: 79
verified: false
draft: false
---

[CF 1845C - 强密码](https://codeforces.com/problemset/problem/1845/C)

 **评分：** 1400
 **标签：** 二分查找、dp、贪心、字符串
 **求解时间：** 1m 19s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求确定 Monocarp 是否可以构造一个长度精确的密码`m`满足三个条件：每个数字必须位于两个字符串的对应数字之间`l`和`r`，密码只能使用数字`0`通过`9`，并且它不能作为给定字符串中的子序列出现`s`代表现有密码的数据库。 输入由多个测试用例组成，每个测试用例指定`s`,`m`,`l`， 和`r`。 对于每种情况，如果至少存在一个有效密码，则输出为“YES”，否则输出为“NO”。 

主要的挑战是`s`可以很长，最多 300,000 个字符，最多可以有 10,000 个测试用例。 这排除了任何单独检查所有可能密码的算法，因为即使对于小密码`m`限制为 10 个，最多可达$10^{10}$最坏情况下的候选人。 不明显的困难在于确保所选密码不会作为子序列出现在`s`，这需要推理所有位置`s`没有明确列举它们。 

一种简单的方法可以尝试生成该范围内的所有序列`[l_i, r_i]`对于每个位置并检查每个位置是否是以下序列的子序列`s`。 例如，如果`s = "123412341234"`,`m = 3`,`l = "111"`， 和`r = "444"`，简单的方法可能会迭代“111”、“112”、...、“444”。 这是不可行的，因为有$4^3 = 64$在这个小例子中的序列，但该方法对于较大范围或`m = 10`。 此外，粗心的实现可能会错误地处理子序列检查，特别是当数字重复或当`l`和`r`在某些位置上是平等的。 

## 方法

 暴力解决方案将生成符合数字限制的每个密码候选者`[l_i, r_i]`对于每个位置并检查它是否作为子序列出现`s`。 检查密码作为子序列需要扫描`s`线性，所以对于长度的候选`m`和一个字符串`s`长度`n`，这需要$O(n)$时间。 由于候选人的数量最多可达$10^{10}$为了`m = 10`，这种方法显然是不切实际的。 

关键的观察是`m`很小，最多 10。这使我们能够将问题视为对密码位置的有界搜索。 我们可以使用动态规划来记录哪些位置，而不是盲目迭代`s`可以匹配部分密码。 具体来说，我们预处理`s`了解每个位置和每个数字`d`下一次出现的位置`d`是。 这使我们能够前进`s`检查子序列时速度很快，减少了天真$O(n)$扫描到$O(1)$预处理完成后每个位置。 在密码位置上使用带有记忆或 DFS 的递归回溯，我们探索了范围`[l_i, r_i]`对于每个字符，并在找到有效密码时尽早停止。 

观察结果表明`m <= 10`并且数字只是`0-9`至关重要。 它允许递归搜索`m`位置，每个位置最多尝试 10 位数字，给出最坏情况的分支$10^{10}$，但实际上预处理`s`快速消除大多数不可能的路径。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(10^m \cdot | s | )) |
 | 最优（下次出现 DP + DFS）| (O( | s | \cdot 10 + 10^m)) 摊销 |

 ## 算法演练

 1. 预处理`s`进入下一个出现表`next_pos[i][d]`在哪里`i`是一个位置`s`和`d`是一个数字`0`到`9`。 该表存储最早的索引≥i，其中数字`d`发生在`s`。 我们从年底开始构建它`s`向后，初始化`next_pos[n][d] = n`（出界）并更新每个`i`与任一`i`如果`s[i] == d`或来自的值`i+1`。 
2. 定义递归函数`can_form(pos, s_index)`检查我们是否可以从密码位置开始完成密码`pos`使用`s`开始于`s_index`。 如果`pos == m`，密码已完全构建并且不会出现在`s`，所以返回 True。 否则，迭代所有数字`d`在范围内`[l[pos], r[pos]]`。 
3. 对于每个数字`d`， 使用`next_pos[s_index][d]`确定最早的地点`s_next`该数字出现在的位置`s`。 如果`s_next`是在结束时`s`，那么剩余的密码不能作为超出此点的子序列出现，这意味着我们可以放置`d`安全。 
4. 递归调用`can_form(pos+1, s_next+1)`。 如果任何分支返回 True，则答案为“YES”。 否则，在探索当前位置的所有数字后，返回 False，表示不存在有效密码。 
5. 对每个测试用例运行上述步骤，打印“YES”或“NO”。 

为什么它有效：预处理保证了对于每个密码位置，我们确切地知道相应的数字可以在哪里匹配`s`。 通过递归地仅探索可行的数字，并在密码完成且不匹配时停止`s`，我们保证正确性。 不变的是`s_index`总是指向当前前缀`s`这可能与密码匹配，任何成功完成都意味着密码不会作为子序列出现。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        s = input().strip()
        m = int(input())
        l = input().strip()
        r = input().strip()
        n = len(s)
        
        # Preprocess next occurrence
        next_pos = [[n]*10 for _ in range(n+1)]
        for i in range(n-1, -1, -1):
            for d in range(10):
                next_pos[i][d] = next_pos[i+1][d]
            next_pos[i][int(s[i])] = i
        
        memo = {}
        def can_form(pos, s_index):
            if pos == m:
                return True
            key = (pos, s_index)
            if key in memo:
                return memo[key]
            for d in range(int(l[pos]), int(r[pos])+1):
                next_i = next_pos[s_index][d]
                if next_i == n:
                    memo[key] = True
                    return True
                if can_form(pos+1, next_i+1):
                    memo[key] = True
                    return True
            memo[key] = False
            return False
        
        print("YES" if can_form(0, 0) else "NO")
```该解决方案的结构首先是预处理`s`有效地，然后递归地探索密码的可能性，同时利用记忆来避免冗余搜索。 边界条件，例如数字没有出现在`s`，通过检查正确处理`next_i == n`。 

## 工作示例

 **样品1**

 | 邮政 | s_索引 | 尝试过的数字| 结果 |
 | --- | --- | --- | --- |
 | 0 | 0 | 5,6 | 找到密码“50”|

 解释： 在`pos=0`, 数字`5`映射到`s_index=5`（第一次出现`5`）。 在`pos=1`, 数字`0`地图之外`s`，因此“50”有效。 

**样品2**

 | 邮政 | s_索引 | 尝试过的数字| 结果 |
 | --- | --- | --- | --- |
 | 0 | 0 | 1,2,3,4 | 全部失败|

 说明： 内的每个数字组合`[111,444]`作为子序列出现在`s="123412341234"`，因此不存在有效的密码。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O( | s |
 | 空间| O( | s |

 该解决方案处理`|s| ≤ 3*10^5`和`m ≤ 10`在时间和内存限制内有效。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    return out.getvalue().strip()

# provided samples
assert run("""5
88005553535123456
2
50
56
123412341234
3
111
444
1234
4
4321
4321
459
2
49
59
00010
2
10
11
""") == "YES\nNO\nYES\nNO\nYES"

# custom cases
assert run("""1
1111
3
```
