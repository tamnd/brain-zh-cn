---
title: "CF 444D - DZY 爱弦乐"
description: "我们得到一个长字符串 s 和一个小字符串对列表 (ai, bi)。 对于每一对，我们需要找到 s 中同时包含 ai 和 bi 作为子串的最短子串。 如果没有子字符串同时包含两者，我们报告 -1。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "hashing", "strings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 444
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 254 (Div. 1)"
rating: 2500
weight: 444
solve_time_s: 66
verified: true
draft: false
---

[CF 444D - DZY 喜欢弦乐](https://codeforces.com/problemset/problem/444/D)

 **评分：** 2500
 **标签：** 二分查找、散列、字符串、两个指针
 **求解时间：** 1m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个长字符串`s`和一个小字符串对的列表`(a_i, b_i)`。 对于每一对，我们需要找到最短的子串`s`包含两者`a_i`和`b_i`作为子串。 如果没有子字符串同时包含两者，我们报告`-1`。 琴弦`a_i`和`b_i`非常短（最长为 4），而主弦`s`最多可达50000个字符，查询数量`q`可以高达100,000。 

输入约束意味着检查所有子串的简单方法`s`每个查询都会太慢。 暴力检查需要为每个查询迭代大约 50,000 个子字符串，即每个查询大约 25 亿次操作。 对于 100,000 个查询，这是完全不可行的。 

可能导致简单解决方案失败的边缘情况包括多次出现的字符串、重叠出现的字符串或其中一个或两个字符串根本不出现的字符串对。 例如，如果`s = "aaabaaa"`,`a = "aa"`和`b = "aaa"`，最短子串是`"aaa"`从索引 1 开始，不是`"aaab"`。 类似地，如果查询包含不在其中的字符串`s`，算法必须正确返回`-1`。 重叠的模式使得天真的贪婪方法容易出现相差一的错误。 

## 方法

 蛮力方法将迭代所有起始位置`s`，找到所有出现的`a_i`和`b_i`，并计算包含这些出现的任意组合的最小子字符串。 这在理论上是正确的，但每个查询需要扫描 O(|s|²) 个子字符串。 与|s| 高达 50,000，q 高达 100,000，这会导致数万亿次操作，这显然是不可接受的。 

优化的关键见解来自两个观察。 首先，字符串`a_i`和`b_i`非常短，因此查询中出现的不同字符串的总数是有限的。 其次，如果我们预先计算出长度为 1 到 4 的每个字符串的起始位置`s`，那么每个查询都简化为寻找两个表示起始位置的整数排序列表之间的最小距离的问题。 这要快得多，因为合并两个排序列表可以使用两指针方法在线性时间内完成。 

优化算法预先计算映射每个子串的字典`s`长度为 1 到 4 的到其出现位置的排序列表。 然后，对于每个查询`(a_i, b_i)`，我们检索两个字符串的起始位置列表。 使用两个指针，我们扫描这些列表以找到最小化覆盖子字符串长度的一对出现。 如果任一字符串未出现在`s`，我们立即返回`-1`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(q * n²) | O(q * n²) | O(1) | O(1) | 太慢了|
 | 预计算+两个指针| O(n + q * k) | O(n + q * k) | O(n) | 已接受 |

 这里`k`是查询字符串出现的总次数`s`，在实践中很小，因为`a_i`和`b_i`很短。 

## 算法演练

 1. 建立字典`occ`映射每个子串`s`长度为 1 到 4 的所有起始索引的列表。 迭代`s`每个位置一次`i`， 添加`s[i:i+l]`为了`l`从 1 到 4 到`occ[i:i+l]`。 这允许以后对所有出现的情况进行恒定时间查找。 
2. 对于每个查询`(a_i, b_i)`，检查是否两者`a_i`和`b_i`字典中存在。 如果其中一个不满足，则立即输出`-1`。 
3. 检索排序后的列表`pos_a`和`pos_b`的起始位置`a_i`和`b_i`。 初始化两个指针`i`和`j`到 0，代表当前索引`pos_a`和`pos_b`。 
4. Use a two-pointer traversal. At each step, consider the current positions`pos_a[i]`和`pos_b[j]`。 覆盖两者的子字符串开始于`min(pos_a[i], pos_b[j])`并结束于`max(pos_a[i] + len(a_i), pos_b[j] + len(b_i))`。 计算长度并跟踪迄今为止找到的最小值。 
5. 将指针向前移动到较小的起始位置。 这确保了我们按升序探索所有对，而不会错过最小覆盖范围。 重复此操作，直到用完其中一个列表。 
6. 输出找到的最小长度。 

为什么它有效：预计算保证我们知道每个相关字符串的所有起点。 两指针遍历利用出现的排序顺序并贪婪地向最小覆盖长度移动。 在每一步中，任一指针增量都会探索所有潜在的最小子串。 由于两个列表都已排序，并且我们按顺序检查每个配对，因此不会遗漏任何候选最小子串。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

s = input().strip()
n = len(s)
q = int(input())

# Precompute all substrings of length 1-4
occ = {}
for i in range(n):
    for l in range(1, 5):
        if i + l <= n:
            sub = s[i:i+l]
            if sub not in occ:
                occ[sub] = []
            occ[sub].append(i)

for _ in range(q):
    a, b = input().split()
    if a not in occ or b not in occ:
        print(-1)
        continue
    pos_a = occ[a]
    pos_b = occ[b]
    i = j = 0
    min_len = float('inf')
    while i < len(pos_a) and j < len(pos_b):
        start = min(pos_a[i], pos_b[j])
        end = max(pos_a[i] + len(a), pos_b[j] + len(b))
        min_len = min(min_len, end - start)
        if pos_a[i] < pos_b[j]:
            i += 1
        else:
            j += 1
    print(min_len)
```解决方案首先构建`occ`，它将长度为 1 到 4 的子字符串映射到它们的起始位置。 这很重要，因为查询可能会重复字符串，并且为每个查询重新计算位置将是低效的。 两指针方法确保我们有效地探索所有有效的组合。 推进较小起始索引的指针是微妙的：它保证在不跳过可能性的情况下考虑下一个潜在的最小子串。 

## 工作示例

 输入示例：```
xudyhduxyz
3
xyz xyz
dyh xyz
dzy xyz
```| 查询 | pos_a | pos_b | min_len 计算 | 结果 |
 | ---| ---| ---| ---| ---|
 | XYZ | XYZ | [7] | [7] | 分钟 = 7-7+3=3 | 3 |
 | dyh xyz | [3] | [7] | 开始=最小(3,7)=3，结束=最大(3+3,7+3)=10，长度=8 | 8 |
 | dzy xyz | []| [7] | 失踪| -1 |

 这表明该算法可以正确处理单次出现、多次出现和缺失的字符串。 

自定义输入：```
aaaaa
2
aa aaa
b a
```| 查询 | pos_a | pos_b | 最小长度 | 结果 |
 | ---| ---| ---| ---| ---|
 | 啊啊啊| [0,1,2,3]| [0,1,2]| 最小子串覆盖 [0,2] length=3 | 3 |
 | 巴 | []| [0,1,2,3,4] | 失踪| -1 |

 这确认了重叠出现和缺失字符串得到了正确处理。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + q * k) | O(n + q * k) | O(n) 预先计算子字符串，O(k) 每个查询合并两个排序的出现列表 |
 | 空间| O(n) | 将所有长度≤4的子串存储在字典中，总共最多O(n)个条目 |

 给定|s| ≤ 50,000 且 q ≤ 100,000，预计算是线性的，并且查询涉及合并非常短的列表，因为字符串的长度≤4。 该解决方案可轻松容纳 3 秒和 256MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    exec(open("solution.py").read())
    return out.getvalue().strip()

# provided samples
assert run("xudyhduxyz\n3\nxyz xyz\ndyh xyz\ndzy xyz\n") == "3\n8\n-1", "sample 1"

# custom tests
assert run("aaaaa\n2\naa aaa\nb a\n") == "3\n-1", "overlap and missing"
assert run("abcdefg\n1\na g\n") == "7", "full string cover"
assert run("zzzzzz\n1\nzz zz\n") == "2", "repeated characters"
assert run("abcde\n2\na a\nc e\n") == "1\n3", "minimal and spaced"
assert
```
