---
title: "CF 1144A - 多样化的琴弦"
description: "我们得到了几个短字符串，对于每个短字符串，我们需要确定它是否形成一个连续的字母表块，没有任何间隙或重复。 将小写字母视为从“a”到“z”的一行。"
date: "2026-06-12T03:30:53+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 1144
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 550 (Div. 3)"
rating: 800
weight: 1144
solve_time_s: 78
verified: true
draft: false
---

[CF 1144A - 多样化的字符串](https://codeforces.com/problemset/problem/1144/A)

 **评分：** 800
 **标签：** 实现、字符串
 **求解时间：** 1m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了几个短字符串，对于每个短字符串，我们需要确定它是否形成一个连续的字母表块，没有任何间隙或重复。 将小写字母视为从“a”到“z”的一行。 当您查看它包含的字母时，如果它们对应于该行的某个连续段，并且每个字母恰好出现一次，则该字符串是有效的。 

因此，像“dabcef”这样的字符串之所以有效，是因为它的字母是 {a, b, c, d, e, f}，它们在字母表中形成了连续的间隔。 字符串内部的顺序对于定义来说并不重要，只有字符集才重要。 另一方面，“az”失败，因为它跳过“a”和“z”之间的所有字母，“babc”失败，因为它重复“b”。 

每个测试用例都是独立的，如果字符串满足这些条件，我们只需输出“Yes”，否则输出“No”。 

约束非常小：最多 100 个字符串，每个字符串的长度最多为 100。这立即排除了每个字符串超出线性工作的任何内容。 即使每个字符串的 O(n^2) 方法仍然是可以接受的，但是任何比检查频率和扫描字母表更复杂的事情都是不必要的开销。 

主要的失败案例通常来自于忘记这两个条件之一。 一是重复，例如“aa”即使是单一字符类型也应该被拒绝。 另一个是字母表中的空白，例如“ac”必须被拒绝，即使两个字母不同，因为它们之间缺少“b”。 

## 方法

 考虑该问题的一种强力方法是尝试连续字母表段的每个可能的起始字母，并检查该字符串是否可以重新排列到该段中。 对于每个候选片段，我们将比较排序的字符或构建频率数组并验证相等性。 这确实有效，但太过分了。 

关键的观察是有效的字符串必须表现得像字母表行上的“路径”。 如果我们对字符集进行排序或推理，最小和最大字母将确定唯一可能的段。 如果字符串有效，则这些极端之间的每个字符都必须恰好出现一次，并且不允许重复。 

这将问题简化为简单的检查：确保唯一性，计算最小和最大字符，并验证不同字符的数量是否等于它们之间的间隔长度。 

这是高效的，因为所有操作在字符串长度上都是线性的，并且字母表大小是恒定的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(26·n²) | O(26·n²) | O(1) | O(1) | 已接受但没有必要 |
 | 最佳 | 每个字符串 O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 对于每个字符串，我们独立处理它。 

1. 我们扫描字符串并记录是否看到任何重复的字符。 如果字符重复，则该字符串立即无效。 这是必需的，因为重复项违反了“每个字母恰好一次”规则。 
2. 扫描时，我们还会按字母顺序跟踪遇到的最小和最大字符。 这为我们提供了潜在的段端点。 
3. 扫描后，我们计算看到了多少个不同的字符。 如果检测到重复项，我们已经知道答案是“否”。 
4. 我们现在比较由最小和最大字符定义的间隔的大小。 区间长度为`(max_char - min_char + 1)`。 
5. 如果不同字符的数量等于此间隔长度，则该范围内的每个字符必须恰好出现一次，因此我们返回“Yes”。 否则，我们返回“否”。 

### 为什么它有效

 核心不变量是有效的字符串必须表示字母表上的完整区间，且不丢失元素。 如果禁止重复，则每个字符在该间隔中恰好贡献一个位置。 如果观察到的字符集的大小为 k，但跨越的间隔大于 k，则中间至少有一个字符丢失，从而破坏连续性。 相反，如果大小与间隔长度匹配并且没有重复项，则该集合必须恰好是间隔，因为没有间隙或额外的空间。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def is_diverse(s: str) -> bool:
    seen = [False] * 26
    mn = 26
    mx = -1

    for ch in s:
        idx = ord(ch) - ord('a')
        if seen[idx]:
            return False
        seen[idx] = True
        mn = min(mn, idx)
        mx = max(mx, idx)

    # number of distinct characters
    cnt = sum(seen)

    return (mx - mn + 1) == cnt

def main():
    n = int(input())
    for _ in range(n):
        s = input().strip()
        print("Yes" if is_diverse(s) else "No")

if __name__ == "__main__":
    main()
```实现直接遵循算法。 布尔数组`seen`确保恒定时间检测重复项。 追踪`mn`和`mx`避免排序或基于集合的范围重建。 最后的比较检查字符是否无间隙地填充整个间隔。 

一个微妙的点是我们只依赖于字符集，而不依赖于它们在字符串中的顺序。 这是安全的，因为条件仅取决于字母表中的相邻性，而不是字符串本身的相邻性。 

## 工作示例

 我们跟踪两个输入：一个有效，一个无效。 

### 示例 1：`"dabcef"`| 步骤| 人物 | 已见设定尺寸| 最小指数| 最大索引 | 复制？ |
 | ---| ---| ---| ---| ---| ---|
 | 1 | d | 1 | 3 | 3 | 没有 |
 | 2 | 一个 | 2 | 0 | 3 | 没有 |
 | 3 | 乙| 3 | 0 | 3 | 没有 |
 | 4 | c | 4 | 0 | 3 | 没有 |
 | 5 | 电子| 5 | 0 | 4 | 没有 |
 | 6 | f | 6 | 0 | 5 | 没有 |

 处理后，`cnt = 6`,`mn = 0`,`mx = 5`。 间隔大小为`5 - 0 + 1 = 6`，它与不同字符的数量匹配，因此结果为“是”。 

这证实无序输入仍然形成连续的字母块。 

### 示例 2：`"babc"`| 步骤| 人物 | 已见设定尺寸| 最小指数| 最大索引 | 复制？ |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 乙| 1 | 1 | 1 | 没有 |
 | 2 | 一个 | 2 | 0 | 1 | 没有 |
 | 3 | 乙| - | - | - | 是的 |

 在第三个字符处，我们检测到“b”已经被看到，所以我们立即返回“No”。 

这表明，即使可以满足字母表间隔条件，仅重复就足以使字符串无效。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n·L) | O(n·L) | 每个字符串被扫描一次，每个字符的所有操作都是 O(1) |
 | 空间| O(1) | O(1) | 只使用固定26长度的数组 |

 鉴于总输入大小最多为 10,000 个字符，这可以在限制范围内轻松运行。 常数因子操作很少，并且以简单的数组索引为主。 

## 测试用例```python
import sys, io

def solve():
    import sys
    input = sys.stdin.readline

    def is_diverse(s: str) -> bool:
        seen = [False] * 26
        mn = 26
        mx = -1

        for ch in s:
            idx = ord(ch) - ord('a')
            if seen[idx]:
                return False
            seen[idx] = True
            mn = min(mn, idx)
            mx = max(mx, idx)

        cnt = sum(seen)
        return (mx - mn + 1) == cnt

    n = int(input())
    for _ in range(n):
        s = input().strip()
        print("Yes" if is_diverse(s) else "No")

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided samples
assert run("""8
fced
xyz
r
dabcef
az
aa
bad
babc
""") == """Yes
Yes
Yes
Yes
No
No
No
No"""

# single letter
assert run("""1
a
""") == "Yes"

# simple invalid gap
assert run("""1
ac
""") == "No"

# full alphabet segment shuffled
assert run("""1
cba
""") == "Yes"

# duplicate inside otherwise valid range
assert run("""1
abca
""") == "No"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单身的`a`| 是的 | 最小长度案例 |
 |`ac`| 没有 | 缺少中间字母 |
 |`cba`| 是的 | 打乱有效段|
 |`abca`| 没有 | 重复检测 |

 ## 边缘情况

 长度为 1 的字符串始终有效，因为它通常形成一个没有间隙且没有重复的连续段。 该算法处理这个问题是因为`mn == mx`和`cnt == 1`，因此间隔检查通过。 

像“az”这样的情况说明了为什么范围检查是必要的。 扫描发现`mn = 0`,`mx = 25`， 和`cnt = 2`。 间隔大小为 26，不匹配，因此即使没有重复项，它也会正确返回“No”。 

像“aa”这样的情况演示了重复规则。 第二个字符在范围逻辑起作用之前立即触发拒绝，从而确保正确性而不依赖于间隔检查。
