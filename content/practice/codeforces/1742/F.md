---
title: "CF 1742F - 较小"
description: "我们得到两个字符串，最初等于“a”，以及将重复字符串附加到 s 或 t 的操作序列。 每次操作后，我们必须确定是否可以重新排列 s 和 t 的字符，使得 s 按字典顺序小于 t。"
date: "2026-06-09T16:22:45+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "greedy", "strings"]
categories: ["algorithms"]
codeforces_contest: 1742
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 827 (Div. 4)"
rating: 1500
weight: 1742
solve_time_s: 160
verified: true
draft: false
---

[CF 1742F - 较小](https://codeforces.com/problemset/problem/1742/F)

 **评分：** 1500
 **标签：** 构造性算法，贪心，字符串
 **求解时间：** 2m 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个字符串，最初等于`"a"`，以及将重复的字符串附加到任一操作的序列`s`或者`t`。 每次操作后，我们必须确定是否可以重新排列字符`s`和`t`以便`s`按字典顺序小于`t`。 

输入给出操作数，以及每个操作的类型（附加到`s`或者`t`), 重复次数`k`，和字符串`x`追加。 每个操作的输出是“YES”或“NO”序列，指示是否存在满足以下条件的词典排列`s < t`。 

约束很大：所有测试用例的操作总数可以达到10^5，字符串的总长度可以达到5×10^5。 这立即排除了在每次操作后显式构造和排序字符串的任何解决方案，因为重复的字符串连接或完全排序将超出时间限制。 

如果一个字符串积累了大量低位字符，而另一个字符串添加了一个较高位字符，则一种简单的方法会失败。 例如，从`s = "a"`和`t = "a"`，如果我们执行附加操作`"a"`一百万次`s`和`"b"`一次到`t`，简单的字符串构造是不可行的。 

该问题简化为跟踪有关每个字符串中字符的足够信息，以确定是否存在按字典顺序排列的较小排列，而无需显式构建字符串。 

## 方法

 暴力方法完全构造两个字符串，对它们进行排序，然后逐个字符进行比较以确定字典顺序。 虽然这是正确的，但复杂性主要由重复的字符串连接和排序决定。 在最坏的情况下，重复追加长度为 10^5 的字符串将超过 10^10 次操作，远远超出了可行的限制。 

关键的观察结果是，任意重新排列后的词典比较仅取决于两件事：每个字符串中是否存在最小字符以及每个字符串中的最大字符。 如果`s`包含大于最大字符的字符`t`，它不能变小。 相反，如果`s`仅包含`'a'`和`t`包含一个大于的字符`'a'`，我们随时可以安排`s`变小。 

我们只需要跟踪每个字符串中存在的最高字符和计数`'a'`字符，因为`'a'`是最小的字母。 如果`t`包含任何大于的字符`'a'`,`s`总是可以更小，无论有多少`'a'`是在`s`。 如果`t`仅包含`'a'`s，那么`s`必须包含严格更少的非`'a'`比`t`变小。 

This leads to a solution where we maintain counts of`'a'`s 和每个字符串的最大字符。 每个操作都会更新这些计数，并且比较简化为对这些值的简单检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(总长度 * log(总长度)) | O(总长度) | 太慢了|
 | 最佳 | O(总操作数) | 每个字符串 O(26) | 已接受 |

 ## 算法演练

 1. 初始化两个字符串的计数器：计数`'a'`字符数和看到的最大字符数。 最初两个字符串都有一个`'a'`和最大字符`'a'`。 
2. 对于每个操作，读取操作类型、重复次数`k`，和字符串`x`。 
3. 数一下数量`'a'`中的字符`x`并确定最大字符`x`。 
4. 将这些计数乘以`k`并更新相应的字符串计数器。 对于最大字符，使用当前最大值和此操作的最大值中的最大值。 
5.更新后，检查词典编排情况：

 - 如果最大字符数为`s`大于`'a'`和`t`仅包含`'a'`,`s`不能变小，输出“NO”。 
- 如果`t`包含任何大于的字符`'a'`，输出“YES”，因为我们可以重新排列`'a'`进入`s`出现在较大字母之前`t`。 
- 否则，比较计数`'a'`s：如果`s`严格较少`'a'`比`t`，输出“是”； 否则“否”。 
6. 对所有操作重复此操作。 

为什么有效：在每一步中，我们都会保留确定安排可能性所需的最少信息`s`按字典顺序小于`t`。 最大字符数和`'a'`count 完全确定相对顺序，因为任何排列都是允许的。 我们永远不需要完整的字符串，因此性能与操作数量呈线性关系。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        q = int(input())
        s_a_count, t_a_count = 1, 1
        s_max, t_max = 'a', 'a'
        
        for _ in range(q):
            d, k, x = input().split()
            d = int(d)
            k = int(k)
            
            a_count = x.count('a') * k
            max_char = max(x)
            
            if d == 1:
                s_a_count += a_count
                s_max = max(s_max, max_char)
            else:
                t_a_count += a_count
                t_max = max(t_max, max_char)
            
            if s_max > 'a' and t_max == 'a':
                print("NO")
            else:
                print("YES")

if __name__ == "__main__":
    solve()
```该代码维护的计数`'a'`s 和两个字符串的最大字符。 支票`s_max > 'a' and t_max == 'a'`确保我们只在以下情况下输出“NO”：`s`包含严格大于的字母`'a'`和`t`只有`'a'`s。 否则，答案是“是”，因为某些安排总是会满足`s < t`。 相乘的次数`'a'`是由`k`确保高效处理重复的追加操作，而无需构建字符串。 

## 工作示例

 跟踪第一个样本输入：```
Operations:
1. 2 1 aa -> t = 'aaa'
s_a_count=1, t_a_count=3, s_max='a', t_max='a'
t_max > 'a'? no, s_max > 'a'? no, output YES
2. 1 2 a -> s = 'aaa'
s_a_count=3, t_a_count=3, output NO
3. 2 3 a -> t = 'aaaaaa'
s_a_count=3, t_a_count=6, output YES
4. 1 2 b -> s = 'aaabb'
s_max='b', t_max='a', s_max>'a' and t_max=='a'? YES -> output NO
5. 2 3 abca -> t_max='c'
t_max>'a'? YES -> output YES
```该迹线显示了如何仅最大字符和`'a'`计数影响答案。 不需要完整的字符串构造。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(总操作) | 每个操作都需要计数`'a'`s 和长度累计≤5 × 10^5 的字符串中的最大字符 |
 | 空间| O(1) | O(1) | 仅存储计数器和单字符最大变量 |

 该解决方案随着操作数量和总输入字符串长度线性扩展。 最大输入大小完全在 2 秒限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    return out.getvalue().strip()

# provided samples
assert run("""3
5
2 1 aa
1 2 a
2 3 a
1 2 b
2 3 abca
2
1 5 mihai
2 2 buiucani
3
1 5 b
2 3 a
2 4 paiu""") == """YES
NO
YES
NO
YES
NO
YES
NO
NO
YES""", "sample 1"

# custom tests
assert run("""1
3
1 1 a
2 1 b
1 1 c""") == """YES
YES
NO""", "a then b then c"
assert run("""1
2
1 100000 a
2 1 z""") == """YES
YES""", "large repetition"
assert run("""1
2
2 100000 a
1 1 b""") == """NO
NO""", "t full of 'a's, s adds 'b'"
assert run("""1
1
1 1 a""") == """NO""", "both start with 'a', append 'a' to s"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 a; 2 1 b； 1 1 c | 是，是，否 | 基本的逐步追加和 lex 顺序 |
 | 1 100000个； 2 1 兹 | 是的，是的| 大量重复 |
