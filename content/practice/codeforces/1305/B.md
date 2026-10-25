---
title: "CF 1305B - Kuroni 和简单弦乐"
description: "算法本身是正确的。 该错误存在于社论的测试工具代码中，而不是算法中。 在发布的解决方案中，对初始化意外地跨行分割：格式化工件在复制时可能会导致问题，更重要的是，帮助程序......"
date: "2026-06-11T17:53:42+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "greedy", "strings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1305
codeforces_index: "B"
codeforces_contest_name: "Ozon Tech Challenge 2020 (Div.1 + Div.2, Rated, T-shirts + prizes!)"
rating: 1200
weight: 1305
solve_time_s: 988
verified: false
draft: false
---

[CF 1305B - Kuroni 和简单字符串](https://codeforces.com/problemset/problem/1305/B)

 **评分：** 1200
 **标签：** 构造性算法、贪心、字符串、两个指针
 **求解时间：** 16m 28s
 **已验证：** 否

 ## 解决方案
 算法本身是正确的。 该错误存在于社论的测试工具代码中，而不是算法中。 

在发布的解决方案中，`pairs`初始化被意外地跨行分割：```python
pairs = [[0] * 26 for _ in range(26)

]
```该格式化工件在复制时可能会导致问题，更重要的是，测试部分中显示的辅助函数从未按照 Codeforces 预期的方式实际打印或返回竞争性编程解决方案的输出。 

让我们在样本上追踪预期的算法：

 输入：```
aaabb
```处理完每个字符后：

 | 字符 | 碳纳米管[a] | 碳纳米管[b] | 对[a][a] | 对[a][b] |
 | ---| ---| ---| ---| ---|
 | 一个 | 1 | 0 | 0 | 0 |
 | 一个 | 2 | 0 | 1 | 0 |
 | 一个 | 3 | 0 | 3 | 0 |
 | 乙| 3 | 1 | 3 | 3 |
 | 乙| 3 | 2 | 3 | 6 |

 所有单字母计数和对计数中的最大值为：```
max(3, 2, 3, 6, 1) = 6
```这是预期的答案。 

这是更正后的完整解决方案：```python
import sys
input = sys.stdin.readline

s = input().strip()

cnt = [0] * 26
pairs = [[0] * 26 for _ in range(26)]

for ch in s:
    c = ord(ch) - ord('a')

    for x in range(26):
        pairs[x][c] += cnt[x]

    cnt[c] += 1

ans = max(cnt)

for i in range(26):
    for j in range(26):
        if pairs[i][j] > ans:
            ans = pairs[i][j]

print(ans)
```这运行在$O(26n)$时间和$O(26^2)$内存，很容易满足限制$n \le 10^5$。
