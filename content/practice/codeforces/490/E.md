---
title: "CF 490E - 恢复递增序列"
description: "我们得到了一个字符串序列。 每个字符串代表一个正整数，但某些数字已被“？”替换。 原始序列是严格递增的。 我们的任务是替换每一个 '?"
date: "2026-06-07T17:42:35+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 490
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 279 (Div. 2)"
rating: 2000
weight: 490
solve_time_s: 126
verified: true
draft: false
---

[CF 490E - 恢复递增序列](https://codeforces.com/problemset/problem/490/E)

 **评级：** 2000
 **标签：** 二分查找、暴力破解、贪心、实现
 **求解时间：** 2m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个字符串序列。 每个字符串代表一个正整数，但有些数字已被替换为`'?'`。 原始序列是严格递增的。 我们的任务是更换每一个`'?'`带有十进制数字，以便所有结果数字都是有效的正整数，没有前导零，并且整个序列变得严格递增。 

序列长度可达$10^5$，而每个数字最多包含 8 个字符。 每个单独数字的小长度是关键的观察结果。 尽管有很多元素，但每个元素都属于一个很小的搜索空间，因为它的长度永远不会超过 8。任何对每个字符串仅执行恒定量工作的解决方案都足够快。 另一方面，尝试所有可能的替代方案是不可能的。 完全由问号组成的长度为 8 的字符串已经代表$10^8$候选人。 

问题最微妙的部分是本地选择会影响后来的数字。 过早选择不必要的大值可能会导致未来的仓位无法实现。 

考虑：```
2
??
10
```第一个数字可以是 99，但第二个数字不能超过它。 正确的选择是大于前一个元素的最小有效数，即10是不可能的，因为序列必须是严格递增的，所以我们选择01？ 不允许有前导零。 实际的答案是：```
YES
9
10
```当长度不同时会出现另一种微妙的情况。```
2
??
???
```任何三位数都大于任何两位数。 贪婪策略应该利用这一点并选择最小的有效两位数字，而不是浪费精力尝试更大的值。 

前导零是另一个常见的错误来源。```
1
?5
```答案可以是 15、25、...、95，但决不能是 05。第一位数字必须保持非零。 

最后，有些情况是不可能的。```
2
99
??
```任何两位数的完成度最多为 99，因此不存在严格更大的值。 正确的输出是：```
NO
```挑战在于为每个位置找到严格大于先前选择的数字的最小有效完成度。 

## 方法

 蛮力方法将生成每个模式的所有可能的完成，然后搜索严格递增的序列。 即使对于长度为 8 的单个字符串，也可能有$10^8$候选人。 乘以$10^5$的立场是完全不可行的。 

问题的结构提出了不同的观点。 一旦前一个值被固定，当前位置只需要一件事：与其模式匹配且严格大于前一个值的最小数字。 如果我们总能找到最小可行值，我们就永远不会损害未来的地位，因为任何更大的选择只会使以后的约束变得更加困难。 

这将问题转化为重复的子问题：

 给定一个模式字符串和一个下界$L$，找到匹配模式的最小数，其值大于$L$。 

8 的长度限制使这变得更容易。 任何候选数都适合一个标准整数。 我们可以逐位构建答案，而不是搜索巨大的数字范围。 

假设模式长度小于数字的位数$L+1$。 那么就不存在解决方案，因为每个候选人的数字都会更少。 

假设图案长度较大。 然后每个候选人都会自动超过$L$，我们只需构建与模式匹配的最小有效数字。 

有趣的情况是两个长度相等。 我们需要字典顺序上最小的完成，至少是$L+1$。 由于长度最多为 8，因此我们可以使用数字 DP 风格的贪心构造。 在每个位置，我们尝试从最小到最大允许的数字，同时跟踪我们是否已经大于绑定前缀。 由于仅存在 8 个位置，因此即使是简单的递归搜索实际上也是恒定时间。 

这给出了序列的线性解。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | '?' 数量呈指数形式 | O(1) | O(1) | 太慢了 |
 | 最佳| O(n) | O(1) | O(1) | 已接受 |

 隐藏常数来自最大长度8，该长度是固定的。 

## 算法演练

 ### 找到高于界限的最小有效完成度

 对于模式字符串`s`和之前的值`prev`，我们必须找到大于的最小匹配数`prev`。 

1. 计算`target = prev + 1`。 
2.如果`len(s) < len(str(target))`，返回失败。 

任何完成的数字都少于`target`，所以达不到要求的值。 
3.如果`len(s) > len(str(target))`，构造与模式匹配的最小有效数。 

任何具有更多位数的数字都会自动大于`prev`。 
4. 如果长度相等，则构建字典顺序最小的补全，即至少`target`。 
5. 使用递归从左到右处理数字。 

跟踪已经选择的前缀是否严格大于对应的前缀`target`。 
6. 就位`i`，枚举模式允许的所有数字。 

如果第一个位置是问号，则禁止使用数字 0。 
7. 如果前缀仍然等于目标前缀，则该位置不允许有小于目标数字的数字。 
8. 按升序尝试数字。 

第一次成功的延续产生最小的有效数字。 
9. 如果没有数字有效，则返回失败。 
10. 开始于`prev = 0`，从左到右处理序列。 

存储每个选定的值并将其用作下一个下限。 
11.如果任意位置失败，输出`"NO"`。 
12.否则输出`"YES"`和构建的序列。 

### 为什么它有效

 加工后位置`i`，该算法存储与该模式匹配但仍超过先前选择的数字的最小可能值。 任何替代的有效选择都将大于或等于所选的选择。 

假设存在完整的解决方案。 用更大的有效值替换任何选定的值并不会让未来的位置变得更容易，因为后面的每个元素都必须严格大于当前的元素。 最小的可行选择总是至少与其他可行选择一样好。 

数字结构也是最佳的。 每当一个位置可能有多个数字时，按升序尝试它们并接受第一个成功的延续会产生字典顺序最小的有效完成。 对于固定长度的数字，字典顺序和数字顺序是一致的。 

通过对序列进行归纳，如果存在解决方案，则算法永远不会通过做出不必要的大选择来消除它。 如果算法报告失败，则该位置不存在有效的完成，因此不存在全局解决方案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def smallest_any(pattern):
    res = []
    m = len(pattern)

    for i, ch in enumerate(pattern):
        if ch != '?':
            if i == 0 and ch == '0':
                return None
            res.append(ch)
        else:
            if i == 0:
                res.append('1')
            else:
                res.append('0')

    return ''.join(res)

def build_ge(pattern, target):
    m = len(pattern)
    t = str(target)

    if len(t) > m:
        return None

    if len(t) < m:
        return smallest_any(pattern)

    memo = {}

    def dfs(pos, greater):
        if pos == m:
            return ""

        key = (pos, greater)
        if key in memo:
            return memo[key]

        if pattern[pos] == '?':
            digits = range(10)
        else:
            digits = [int(pattern[pos])]

        for d in digits:
            if pos == 0 and d == 0:
                continue

            td = int(t[pos])

            if not greater and d < td:
                continue

            ngreater = greater or (d > td)

            suffix = dfs(pos + 1, ngreater)
            if suffix is not None:
                memo[key] = str(d) + suffix
                return memo[key]

        memo[key] = None
        return None

    return dfs(0, False)

def solve():
    n = int(input())
    patterns = [input().strip() for _ in range(n)]

    ans = []
    prev = 0

    for s in patterns:
        cur = build_ge(s, prev + 1)
        if cur is None:
            print("NO")
            return

        val = int(cur)
        ans.append(cur)
        prev = val

    print("YES")
    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```帮手`smallest_any`当模式长度已经大于所需的边界长度时使用。 在这种情况下，每个有效的完成都会自动满足递增条件，因此我们只需构造最小的合法数字。 

功能`build_ge`处理实际工作。 当长度匹配时，它会执行逐位搜索。 状态由当前位置和一个布尔值组成，该布尔值指示构造的前缀是否已经大于目标前缀。 由于布尔值最多有 8 个位置且只有两个可能值，因此记忆表最多包含 16 个状态。 

递归搜索总是按升序尝试数字。 第一个成功的分支是最小有效完成。 这是正确实现贪婪选择的关键细节。 

主循环从左到右处理序列。 一旦选择了一个值，它就成为下一个位置的下限。 由于每个选择的值在所有可行选择中都是最小的，因此未来的位置尽可能不受约束。 

## 工作示例

 ### 示例 1

 输入：```
3
?
18
1?
```| 位置 | 图案| 必填 > | 选择|
 | --- | --- | --- | --- |
 | 1 | ？ | 0 | 1 |
 | 2 | 18 | 18 1 | 18 | 18
 | 3 | 1？ | 18 | 18 19 | 19

 输出：```
YES
1
18
19
```最后一种模式只能产生 19 个。 值 10 到 18 失败，因为序列必须保持严格递增。 

### 示例 2

 输入：```
3
??
??
??
```| 位置 | 图案| 必填 > | 选择|
 | --- | --- | --- | --- |
 | 1 | ?? | 0 | 10 | 10
 | 2 | ?? | 10 | 10 11 | 11
 | 3 | ?? | 11 | 11 12 | 12

 输出：```
YES
10
11
12
```这个例子说明了中心贪婪属性。 在每一步选择最小的可行值自然会为后面的位置留下最大的空间。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个模式的处理时间为 O(8 × 2 × 10)，这是常数 |
 | 空间| O(1) | O(1) | DP 仅包含恒定数量的状态 |

 由于每个字符串长度都以 8 为界，因此每个元素的工作量永远不会随着输入大小的增加而增加。 即使是为了$n = 10^5$，该算法仅执行几百万次原始操作，完全在限制范围内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve_io(inp: str) -> str:
    input = io.StringIO(inp).readline

    def smallest_any(pattern):
        res = []
        for i, ch in enumerate(pattern):
            if ch != '?':
                if i == 0 and ch == '0':
                    return None
                res.append(ch)
            else:
                res.append('1' if i == 0 else '0')
        return ''.join(res)

    def build_ge(pattern, target):
        m = len(pattern)
        t = str(target)

        if len(t) > m:
            return None

        if len(t) < m:
            return smallest_any(pattern)

        memo = {}

        def dfs(pos, greater):
            if pos == m:
                return ""

            key = (pos, greater)
            if key in memo:
                return memo[key]

            digits = range(10) if pattern[pos] == '?' else [int(pattern[pos])]

            for d in digits:
                if pos == 0 and d == 0:
                    continue

                td = int(t[pos])

                if not greater and d < td:
                    continue

                suf = dfs(pos + 1, greater or d > td)
                if suf is not None:
                    memo[key] = str(d) + suf
                    return memo[key]

            memo[key] = None
            return None

        return dfs(0, False)

    n = int(input())
    prev = 0
    ans = []

    for _ in range(n):
        s = input().strip()
        cur = build_ge(s, prev + 1)
        if cur is None:
            return "NO\n"
        ans.append(cur)
        prev = int(cur)

    return "YES\n" + "\n".join(ans) + "\n"

def run(inp: str) -> str:
    return solve_io(inp)

# provided sample
assert run("3\n?\n18\n1?\n") == "YES\n1\n18\n19\n"

# minimum size
assert run("1\n?\n") == "YES\n1\n"

# impossible case
assert run("2\n99\n??\n") == "NO\n"

# increasing through same-length patterns
assert run("3\n??\n??\n??\n") == "YES\n10\n11\n12\n"

# length increase
assert run("2\n9\n???\n") == "YES\n9\n100\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 ?`|`1`| 最小输入尺寸|
 |`99, ??`|`NO`| 不可能增加条件|
 |`??, ??, ??`|`10,11,12`| 反复贪心选择|
 |`9, ???`|`9,100`| 过渡到更大的数字长度 |

 ## 边缘情况

 考虑：```
2
99
??
```第一个值固定为 99。第二个模式只能生成两位数字。 该算法计算`target = 100`。 由于目标长度为 3，而模式长度为 2，因此它立即返回失败。 输出：```
NO
```现在考虑：```
2
?
100
```第一个模式变为 1。对于第二个模式，所需的界限仅为 2。其长度大于目标长度，因此算法构造最小的有效补全，即 100。输出：```
YES
1
100
```考虑前导零陷阱：```
1
?5
```该算法尝试从 1 开始第一个位置的数字，因为前导位置禁止使用零。 最小的完成度是 15，而不是 05。输出：```
YES
15
```最后：```
2
1?
1?
```第一个模式变为 10。对于第二个模式，目标为 11。在数字构造期间，第一个数字必须保持为 1。第二个数字不能为 0，因为这会产生 10，低于目标。 搜索选择 1，产生 11。输出：```
YES
10
11
```此示例显示了如何与下限进行逐位比较来强制执行严格增加，而无需枚举所有可能的数字。
