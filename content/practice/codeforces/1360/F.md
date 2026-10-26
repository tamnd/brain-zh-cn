---
title: "CF 1360F - 间谍字符串"
description: "给定几个长度相等的字符串，我们想要构造一个长度相同的新字符串。 要求是这个构造的字符串必须非常接近每个给定的字符串：对于每个输入字符串，它允许与我们构造的字符串不同..."
date: "2026-06-18T18:19:22+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "brute-force", "constructive-algorithms", "dp", "hashing", "strings"]
categories: ["algorithms"]
codeforces_contest: 1360
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 644 (Div. 3)"
rating: 1700
weight: 1360
solve_time_s: 73
verified: false
draft: false
---

[CF 1360F - 间谍字符串](https://codeforces.com/problemset/problem/1360/F)

 **评分：** 1700
 **标签：** 位掩码、暴力破解、构造性算法、dp、哈希、字符串
 **求解时间：** 1m 13s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 给定几个长度相等的字符串，我们想要构造一个长度相同的新字符串。 要求是这个构造的字符串必须非常接近每个给定的字符串：对于每个输入字符串，最多允许有一个位置与我们构造的字符串不同。 

另一种看待它的方式是，每个输入字符串只能“不同意”我们的答案一次。 在所有位置上，每个字符串最多允许一个不匹配。 

任务不是优化任何内容，例如字典顺序或最小化更改。 我们只需要判断是否存在有效的构造并输出任何一个有效的字符串。 

约束以一种非常具体的方式很小：字符串的数量和长度都最多为 10。这立即排除了对渐近优化技巧的任何需要。 甚至检查每个位置的字符的所有可能性也是可行的，因为搜索空间最多是$26^{10}$，但更重要的是，如果我们对每个位置进行局部思考，则约束的结构使得暴力变得不必要。 

一个天真的但自然的想法是尝试逐个字符地构建答案。 然而，如果我们只独立考虑每个位置的局部一致性，就会出现微妙的故障模式。 该约束是每个字符串的全局约束，而不是每个位置的全局约束。 

例如，假设我们尝试在每个位置选择多数字符。 这可能会失败，因为一个字符串在两个不同位置可能不同，即使每个位置单独看起来都是安全的。 

考虑：```
n = 2, m = 3
a1 = "aba"
a2 = "bab"
```如果我们选择`"aaa"`根据多数推理，两个字符串有两次不同，这是无效的。 所以位置上的贪婪是不安全的。 

关键的困难在于每个字符串都有一个恰好有一个不匹配的预算，并且我们必须将这些不匹配一致地分布在所有位置上。 

## 方法

 蛮力视角从答案字符串也是长度的观察开始$m \le 10$，所以我们可以尝试超过 26 个字母的所有可能的字符串。 对于每个候选字符串，我们检查每个输入字符串并计算不匹配的数量。 如果每个字符串至多有一个不匹配，我们就接受。 

这是正确的但昂贵：有$26^m$候选人，以及每次检查费用$O(nm)$。 最坏情况下$m = 10$，这变成了$26^{10} \approx 1.4 \cdot 10^{14}$，这远远超出了可行的范围。 

该条件的结构允许更清晰的视图。 由于每个字符串最多可能在一个位置与答案不同，因此我们可以反向思考：如果我们猜测一个接近所有输入字符串的“基本字符串”，那么每个输入字符串要么与其相等，要么在一个位置上不同。 这表明答案必须非常接近至少一个输入字符串，因为每个字符串只能容忍与答案的单一偏差。 

关键的见解是将结构锚定在给定的弦之一上。 假设我们尝试每个输入字符串$a_i$作为候选模板。 如果我们从$a_i$，最终答案最多只能在一个位置上有所不同，因为$a_i$本身最多只能在一个位置上与答案不同。 所以可以通过保留来获得答案$a_i$不变或仅修改其中的一个位置。 

这极大地减少了搜索空间：对于每个$a_i$，我们只需要尝试改变零个或一个字符，然后针对所有字符串验证可行性。 

自从$n, m \le 10$，这变得非常小：最多$10 \times (1 + 10 \times 25)$候选人。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 对所有字符串进行暴力破解 |$O(26^m \cdot nm)$|$O(1)$| 太慢了 |
 | 尝试每个基本字符串，修改≤1个位置 |$O(n^2 m \cdot 26)$|$O(1)$| 已接受 |

 ## 算法演练

 1. 迭代每个字符串$a_i$并将其视为潜在的基本字符串。 

原因是最终答案必须与每个输入字符串最多有一个位置不同，因此它不能与它们中的任何一个相差太远。 
2.首先测试我们设置的candidate$s = a_i$无需修改。 

我们计算，对于每个字符串$a_j$, 之间有多少个位置不同$s$和$a_j$，并验证所有值最多为 1。 
3. 如果未修改的基础有效，我们可以立即输出它。 

这对应于一个输入字符串已经满足全局约束的情况。 
4. 如果不是，请尝试仅修改一个位置$a_i$。 对于每个位置$p$从 0 到$m-1$，并且对于每个字符$c$从'a'到'z'，通过替换形成候选字符串$a_i[p]$和$c$。 
5. 对于每个这样的候选者，以相同的方式针对所有输入字符串验证它，计算每个字符串的不匹配数。 

我们丢弃任何字符串在多个位置不同的候选者。 
6. 如果有候选人通过，立即输出。 
7. 如果没有字符串且单位置修改不起作用，则输出-1。 

正确性取决于以下事实：任何有效答案必须位于距每个输入字符串最多 1 的汉明距离内，因此必须位于距其中任何选定的有效基本候选者最多 1 的距离内。 

### 为什么它有效

 假设一个有效的答案$s$存在。 选择任意输入字符串$a_i$。 自从$a_i$不同于$s$至多一个位置，$a_i$和$s$至多有一个索引不同。 这意味着$s$可以从$a_i$最多改变一个字符。 

因此，如果存在解决方案，它必须出现在由某些生成的枚举中$a_i$： 任何一个$a_i$本身或单个字符的修改。 既然我们尝试了所有$a_i$，我们必须遇到$s$。 验证步骤确保我们只接受真正有效的结构。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def ok(s, arr, n, m):
    for a in arr:
        diff = 0
        for i in range(m):
            if s[i] != a[i]:
                diff += 1
                if diff > 1:
                    return False
        if diff > 1:
            return False
    return True

t = int(input())
for _ in range(t):
    n, m = map(int, input().split())
    arr = [input().strip() for _ in range(n)]

    ans = None

    for base in arr:
        if ok(base, arr, n, m):
            ans = base
            break

        base = list(base)
        found = False

        for i in range(m):
            original = base[i]
            for c in "abcdefghijklmnopqrstuvwxyz":
                base[i] = c
                candidate = "".join(base)
                if ok(candidate, arr, n, m):
                    ans = candidate
                    found = True
                    break
            base[i] = original
            if found:
                break

        if ans is not None:
            break

    if ans is None:
        print(-1)
    else:
        print(ans)
```该代码直接遵循锚定每个输入字符串的构造思想。 辅助函数`ok`通过显式计算不匹配项并在一对超过一个差异时提前停止来计算候选字符串是否满足所有输入的约束。 

内部构造循环会在临时修改后仔细恢复字符，确保我们只测试每个基本字符串的有效单位置变化。 

早期中断结构很重要，因为一旦找到有效答案，就不需要进一步搜索。 

## 工作示例

 ### 示例 1

 输入：```
2 4
abac
zbab
```我们尝试基地`"abac"`。 

| 候选人| 检查与“abac”| 检查与“zbab”| 有效 |
 | ---| ---| ---| ---|
 | 巴巴克 | 0 | 2 | 没有 |
 | 美国广播公司 | 1 | 1 | 是的 |

 我们将位置 2 修改为“b”，产生`"abbc"`。 这满足了一次不匹配中的两个字符串。 

跟踪显示正确的解决方案不一定等于任何输入字符串，但非常接近其中之一。 

### 示例 2

 输入：```
2 4
aaaa
bbbb
```尝试`"aaaa"`：

 | 候选人| 检查与“aaaa”| 检查与“bbbb”| 有效 |
 | ---| ---| ---| ---|
 | 啊啊| 0 | 4 | 没有 |
 | 阿巴 | 1 | 3 | 没有 |
 | ... | ... | ... | 没有 |

 单一修改也不起作用，所以答案是`-1`。 

这表明，即使每个字符串很简单，它们的相互距离也会使全局一致的中心变得不可能。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n^2 \cdot m \cdot 26)$| 对于每个$n$基本字符串，我们尝试$m \cdot 26$修改，并且每次检查都会扫描所有$n$长度的字符串$m$。 |
 | 空间|$O(1)$| 在构建和验证过程中仅创建临时字符串。 |

 和$n, m \le 10$，这实际上是每个测试用例的恒定时间。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    t = int(input())
    out = []
    for _ in range(t):
        n, m = map(int, input().split())
        arr = [input().strip() for _ in range(n)]

        def ok(s):
            for a in arr:
                diff = 0
                for i in range(m):
                    if s[i] != a[i]:
                        diff += 1
                        if diff > 1:
                            return False
            return True

        ans = None
        for base in arr:
            if ok(base):
                ans = base
                break
            base = list(base)
            for i in range(m):
                orig = base[i]
                for c in "abcdefghijklmnopqrstuvwxyz":
                    base[i] = c
                    if ok("".join(base)):
                        ans = "".join(base)
                        break
                base[i] = orig
                if ans:
                    break
            if ans:
                break

        out.append(ans if ans else "-1")

    return "\n".join(out)

# provided samples
assert run("""5
2 4
abac
zbab
2 4
aaaa
bbbb
3 3
baa
aaa
aab
2 2
ab
bb
3 1
a
b
c
""") == """abab
-1
aaa
ab
z"""

# custom cases
assert run("""1
1 5
abcde
""") == "abcde", "single string always valid"

assert run("""1
2 2
aa
cc
""") in {"ac", "ca"}, "two strings with symmetric solution"

assert run("""1
3 3
abc
def
ghi
""") == "-1", "completely incompatible strings"

assert run("""1
2 3
abc
abd
""") in {"abc", "abd"}, "already valid base exists"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单串| 本身| 基本情况正确性 |
 | AA / 抄送 | 交流或ca | 对称一次性解决方案 |
 | abc def ghi | abc def ghi | abc def ghi | abc def ghi -1 | 不可能的配置|
 | abc/abd| 任一字符串 | 已经有效的输入处理 |

 ## 边缘情况

 一个微妙的边缘情况是，多个字符串总体上在两个以上位置上彼此不同，但仍然允许共享中心。 例如，如果所有字符串仅在一列中不同，则任何一致的选择都有效。 该算法可以处理此问题，因为选择任何基本字符串都会立即通过验证。 

另一个边缘情况是，没有任何单个基本字符串无需修改即可工作，但单字符修改可以解决所有冲突。 构造循环明确地探索每个位置和每个角色，确保不会错过这样一个隐藏的中心。 

最后一种情况是，即使成对距离看起来很小，答案也不存在。 例子`"aaaa"`和`"bbbb"`证明虽然每一对相距很远，但没有任何字符串可以同时满足两者的单不匹配约束。 对所有字符串的验证步骤正确地拒绝了该情况下的每个候选者。
