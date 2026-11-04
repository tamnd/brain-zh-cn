---
title: "CF 1800B - 计算线对数量"
description: "克里斯蒂娜有一串可以是小写或大写的字母。 对于每对由小写字母及其相应的大写字母组成的有效对，她都会获得一个树节。 每个字母只能参与一对。"
date: "2026-06-09T09:37:40+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "strings"]
categories: ["algorithms"]
codeforces_contest: 1800
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 855 (Div. 3)"
rating: 1000
weight: 1800
solve_time_s: 177
verified: true
draft: false
---

[CF 1800B - 计算对数](https://codeforces.com/problemset/problem/1800/B)

 **评分：** 1000
 **标签：** 贪心，字符串
 **求解时间：** 2m 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 克里斯蒂娜有一串可以是小写或大写的字母。 对于每对由小写字母及其相应的大写字母组成的有效对，她都会获得一个树节。 每个字母只能参与一对。 另外，她最多能表演$k$她将单个字母的大小写翻转的操作，从小写变为大写，或者相反。 目标是计算她在申请最多后可以形成的最大配对数$k$运营。 

输入由多个测试用例组成，每个测试用例指定字符串长度$n$, 允许的操作次数$k$，和字符串$s$。 每个测试用例的输出是 Kristina 可以形成的最大配对数。 

约束条件允许$n$达到$2 \cdot 10^5$所有测试用例的总计。 这排除了任何考虑翻转的所有子集或显式检查所有配对的暴力方法，因为最坏情况下的操作数量将是指数级的。 我们需要一个线性处理每个字符串的解决方案，最好是$O(n)$时间。 

当小写字母和大写字母的数量相差超过$2k$。 粗心的解决方案可能只是尝试贪婪地配对现有字母，然后使用$k$操作而不检查剩余的字母是否实际上可以转换成新的对。 例如，用字符串`aaaBBB`和$k = 1$，有三个`a`和三`B`s。 一种幼稚的方法可能认为我们可以使用一个操作创建两个额外的对，但实际上只能创建一个额外的对，因为转换一个额外的对`a`到`A`只允许与一个配对`B`。 

## 方法

 暴力解决方案将尝试枚举所有可能的方法来翻转$k$字母并计算每种情况形成的对的数量。 这显然是不可行的，对于$n$最多$2 \cdot 10^5$和$k$最多$n$，要翻转的字母子集的数量以组合方式增长。 

关键的见解是字母的顺序对于计数对来说并不重要。 我们只关心每个小写和大写字母的数量。 对于每个角色`x`，自然对的数量是计数中的最小值`x`和`X`。 一种情况下的任何剩余字母都可以使用每两个剩余字母进行一次操作来转换为另一种情况，以形成额外的一对。 例如，如果有三个额外的小写字母`a`s 和一个额外的大写字母`A`，我们可以用一个操作来转换一个额外的`a`到`A`并创建一个额外的对。 

最佳解决方案对字母进行计数，形成自然对，然后使用两个一组的剩余字母以及可用的操作来形成额外的对。 这将问题减少到$O(n)$每个测试用例的时间和$O(1)$频率数组之外的额外空间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(26) | 已接受 |

 ## 算法演练

 1.初始化两个数组`lower`和`upper`大小为 26 来计算每个小写和大写字母的出现次数。 
2. 迭代字符串。 对于小写字母`c`, 增量`lower[ord(c)-ord('a')]`。 对于大写字母`C`, 增量`upper[ord(C)-ord('A')]`。 
3. 初始化`pairs = 0`。 对于每个字母索引`i`从 0 到 25，计算`natural_pairs = min(lower[i], upper[i])`。 添加`natural_pairs`到`pairs`。 减去`natural_pairs`来自两者`lower[i]`和`upper[i]`。 
4. 形成自然对后，对于每个字母索引`i`，通过大小写翻转计算可以形成额外对的剩余字母：`extra_pairs_possible = min((lower[i] // 2) + (upper[i] // 2), k)`。 添加`extra_pairs_possible`到`pairs`并减少`k`经过`extra_pairs_possible`。 
5. 返回`pairs`。 

不变的是每一步，`pairs`反映仅使用所占字母的最大对数，并且`k`是仍然可用的翻转次数。 由于一对需要每个案例中的一个或同一案例中的两个进行翻转，因此该算法正确地最大化了对的数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def max_burles(n, k, s):
    lower = [0] * 26
    upper = [0] * 26
    
    for c in s:
        if c.islower():
            lower[ord(c) - ord('a')] += 1
        else:
            upper[ord(c) - ord('A')] += 1
            
    pairs = 0
    for i in range(26):
        natural_pairs = min(lower[i], upper[i])
        pairs += natural_pairs
        lower[i] -= natural_pairs
        upper[i] -= natural_pairs
        
    for i in range(26):
        extra_pairs = min((lower[i] // 2) + (upper[i] // 2), k)
        pairs += extra_pairs
        k -= extra_pairs
        if k <= 0:
            break
            
    return pairs

t = int(input())
for _ in range(t):
    n, k = map(int, input().split())
    s = input().strip()
    print(max_burles(n, k, s))
```第一个循环计算字母并处理自然对。 第二个循环使用允许的操作考虑潜在额外对的剩余字母。 使用整数除法可确保仅计算完整的对，并提前中断一次`k`耗尽可以防止不必要的计算。 

## 工作示例

 输入样本`aAaaBACacbE`，k = 2：

 | 信| 降低| 上层| 自然对| 剩余| 额外对 |
 | --- | --- | --- | --- | --- | --- |
 | 一个 | 3 | 1 | 1 | 2/0 | 1 |
 | 乙| 1 | 1 | 1 | 0/0 | 0 |
 | c | 2 | 1 | 1 | 1/0 | 0 |
 | ... | ... | ... | ... | ... | ... |`pairs`= 4 自然对后。 我们可以使用一次操作获得 1 个剩余的额外对`a`。 最终的`pairs`= 5。 

输入样本`ab`，k = 2：

 | 信| 降低| 上层| 自然对| 剩余| 额外对 |
 | --- | --- | --- | --- | --- | --- |
 | 一个 | 1 | 0 | 0 | 1 | 0 |
 | 乙| 1 | 0 | 0 | 1 | 0 |

 不可能有自然对和额外对，因为需要两个相同的情况。 最终的`pairs`= 0。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 我们对字符串进行一次迭代，然后对 26 个字母进行两次迭代。 |
 | 空间| O(1) | O(1) | 仅使用两个大小为 26 的数组，与 n 无关。 |

 这符合约束条件：对于最大总数 n$2 \cdot 10^5$，算法将在 2 秒内高效运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    t = int(input())
    res = []
    for _ in range(t):
        n, k = map(int, input().split())
        s = input().strip()
        res.append(str(max_burles(n, k, s)))
    return "\n".join(res)

# Provided samples
assert run("5\n11 2\naAaaBACacbE\n2 2\nab\n4 1\naaBB\n6 0\nabBAcC\n5 3\ncbccb\n") == "5\n0\n1\n3\n2"

# Custom cases
assert run("1\n1 0\na\n") == "0", "single lowercase letter, no pair"
assert run("1\n2 1\nAa\n") == "1", "already a pair"
assert run("1\n4 2\naabb\n") == "2", "flip one pair possible"
assert run("1\n6 3\nAAaaaa\n") == "3", "maximize with flips"
assert run("1\n3 1\nABC\n") == "0", "all uppercase, insufficient flips"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n1 0\na\n`| 0 | 单个字符，不可能成对 |
 |`1\n2 1\nAa\n`| 1 | 已经是天生一对 |
 |`1\n4 2\naabb\n`| 2 | 翻转可以形成额外的对 |
 |`1\n6 3\nAAaaaa\n`| 3 | 使用翻转最大化配对 |
 |`1\n3 1\nABC\n`| 0 | 全部大写，翻转不足|

 ## 边缘情况

 在这种情况下`aaBB`k = 1，`lower`= [2],`upper`= [2]。 自然对 = 2。剩余 = 0。额外对 = 0。正确输出 = 1 如果
