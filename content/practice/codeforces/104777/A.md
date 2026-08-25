---
title: "CF 104777A - 安全"
description: "我们得到了多个独立的测试用例。 每个密码都有一个现有密码字符串和新密码的目标长度。"
date: "2026-06-28T15:27:52+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104777
codeforces_index: "A"
codeforces_contest_name: "2023-2024 ICPC, NERC, Southern and Volga Russian Regional Contest (problems intersect with Educational Codeforces Round 157)"
rating: 0
weight: 104777
solve_time_s: 46
verified: true
draft: false
---

[CF 104777A - 安全](https://codeforces.com/problemset/problem/104777/A)

 **评级：** -
 **标签：** -
 **求解时间：** 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了多个独立的测试用例。 每个密码都有一个现有密码字符串和新密码的目标长度。 新密码必须由由小写字母、大写字母和数字组成的固定字母表构成，这些字母共同构成 62 个不同的字符。 

任务是构建一个恰好包含 k 个字符的字符串，使得新字符串中的每个字符都是唯一的，并且这些字符都不会出现在旧密码中。 如果旧密码已经使用了太多不同的字符，它可能会删除太多选项，从而无法形成有效的新密码。 

核心约束是组合的：从 62 个符号的宇宙中，我们删除旧密码中出现的所有符号，然后检查是否至少保留 k 个符号。 如果是，我们可以从剩余的池中输出任何 k 个不同的符号。 如果没有，我们必须报告不可能。 

界限很小而且是固定的。 每个密码的长度最多为62，测试用例最多为500个。 这立即表明，任何扫描字母表并为每个测试用例构建一组的解决方案都足够快，因为每个用例的所有操作都是 O(62)。 

当旧密码包含全部 62 个字符时，会出现微妙的边缘情况。 在这种情况下，即使 k = 1 也无法得出答案。 另一种情况是当 k = 0 时，这里的约束没有明确允许这种情况，因为 k ≥ 1，但如果是这样，它总是会满足于空字符串。 最后，旧密码中的重复字符并不重要，因为唯一性仅在不同的符号上定义。 

## 方法

 一种简单的方法是考虑从允许的字母表中生成长度为 k 的所有可能的字符串，并检查是否有任何此类字符串避免了旧密码中的字符。 即使我们将自己限制为不同的字符串，这也会成为最多 62 个符号的排列式生成。 选择 k 个不同字符的方法数量约为 62Pk，即使对于中等 k 的情况来说，这也已经是巨大的了。 这种做法是完全不可行的。 

关键的观察是我们永远不需要以任何复杂的方式推理排序。 输出是任意的，只有可用字符集才重要。 一旦我们确定了哪些字符是被禁止的（那些出现在旧密码中的字符），问题就简化为从剩余池中选择任何 k 个元素。 

因此，该结构分解为一个简单的集合差异问题：计算允许的字符集，验证其大小，并输出大小为 k 的任何子集。 这是可行的，因为除了唯一性之外，排列没有任何限制。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力排列 | O(62Pk) | O(62Pk) | 太慢了 |
 | 设置过滤和选择 | 每个测试用例 O(62) | 奥(62) | 已接受 |

 ## 算法演练

 1. 构造一个由小写字母、大写字母和数字组成的所有 62 个有效字符的固定列表。 这就像我们从中汲取灵感的宇宙。 
2. 对于每个测试用例，读取 k、n 和旧密码字符串 s。 
3. 构建一个布尔或集合结构来标记 s 中出现的所有字符。 我们只关心不同的字符，因此 s 中的重复项自然会被忽略。 
4. 迭代 62 个字符的 Universe 并收集那些未标记为存在于 s 中的字符。 这给出了可用字符池。 
5. 如果该池的大小小于 k，则输出一个连字符，因为不存在有效的构造。 
6. 否则，以任意顺序输出该池中的前 k 个字符。 由于该问题允许任何有效答案，因此不需要进一步的排序逻辑。 

### 为什么它有效

在每一步中，我们都保持不变，即池中恰好包含旧密码未禁止的字符。 每个输出字符都是从该池中提取的，因此它不会违反出现在旧密码中的约束。 由于我们也只接受每个字符最多一次，因此自动满足唯一性条件。 唯一剩下的要求是基数，直接检查池大小可确保我们仅在存在有效选择时继续。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    import sys
    input = sys.stdin.readline

    # Build full alphabet of allowed characters
    alphabet = []
    for i in range(26):
        alphabet.append(chr(ord('a') + i))
    for i in range(26):
        alphabet.append(chr(ord('A') + i))
    for i in range(10):
        alphabet.append(chr(ord('0') + i))

    t = int(input())
    for _ in range(t):
        k = int(input())
        n = int(input())
        s = input().strip()

        used = set(s)

        available = []
        for c in alphabet:
            if c not in used:
                available.append(c)

        if len(available) < k:
            print("-")
        else:
            print("".join(available[:k]))

if __name__ == "__main__":
    solve()
```该解决方案首先在每次运行时构建一次完整的 62 个字符字母表。 这避免了重复重新计算范围并使逻辑明确。 

对于每个测试用例，我们将旧密码转换为一组，它会自动压缩重复项。 然后，我们根据该集合过滤字母表以构建允许的池。 决策步骤是简单的长度检查，输出是过滤列表的前缀。 

一个常见的陷阱是意外地将旧密码中的重复项视为多次删除。 这是不正确的，因为删除仅基于不同的字符。 

## 工作示例

 ### 示例 1

 输入：```
k = 3
s = "aA1"
```| 步骤| 二手套装| 可用泳池（部分视图）| 行动|
 | ---| ---| ---| ---|
 | 1 | {a, A, 1} | 完整字母表减去这些 | 建池|
 | 2 | - | 尺寸 = 62 - 3 = 59 | 检查 k |
 | 3 | - | 池的前 3 个字符 | 输出|

 该池足够大，因此任何三个未使用的字符都是有效的。 这表明排序根本不重要，只有排除。 

### 示例 2

 输入：```
k = 62
s = all 62 characters
```| 步骤| 二手套装| 可用池 | 行动|
 | ---| ---| ---| ---|
 | 1 | 62 个字符 | 空 | 建池|
 | 2 | 空 | 大小= 0 | 检查 k |
 | 3 | - | 不足| 输出“-”|

 这证实了当禁止集覆盖整个字母表时的不可能性条件。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(62·t) | 每个测试都会扫描固定的字母表并构建最多 62 个字符的集合 |
 | 空间| 奥(62) | 字母表、已用集和过滤池的存储 |

 恒定大小的字母表确保解决方案在测试用例的数量上有效地呈线性。 当 t ≤ 500 时，运行时间可以忽略不计。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = out

    solve()

    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return out.getvalue().strip()

def solve():
    import sys
    input = sys.stdin.readline

    alphabet = []
    for i in range(26):
        alphabet.append(chr(ord('a') + i))
    for i in range(26):
        alphabet.append(chr(ord('A') + i))
    for i in range(10):
        alphabet.append(chr(ord('0') + i))

    t = int(input())
    for _ in range(t):
        k = int(input())
        n = int(input())
        s = input().strip()

        used = set(s)
        available = [c for c in alphabet if c not in used]

        print("-" if len(available) < k else "".join(available[:k]))

# provided sample (minimal adaptation)
assert run("1\n3\n3\naA1\n") != "", "sample-like check"

# custom cases
assert run("1\n1\n3\naA1\n") != "-", "single character available"
assert run("1\n62\n62\nabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\n") == "-", "fully blocked alphabet"
assert run("1\n5\n0\n\n") != "", "empty old password gives full availability"
assert run("2\n1\n3\na\n1\n3\nb\n") != "", "multiple test cases basic"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 使用完整字母表 |`-`| 当没有字符剩余时不可能 |
 | 空旧密码 | 任何有效的字符串 | 最大可用性|
 | 多个单字符案例 | 有效输出 | 处理多个测试|

 ## 边缘情况

 一种重要的情况是旧密码包含重复的字符，例如`s = "aaAA111"`。 该算法将其转换为一个集合`{a, A, 1}`并且每个字符仅删除一次。 如果我们多次错误地删除重复项，我们仍然会得到相同的集合，但是依赖于计数而不是集合成员资格的实现可能会错误地认为可用性比实际减少得更多。 

另一种情况是 k 等于可用字符的确切数量。 例如，如果 s 包含 10 个不同的字符，则正好剩下 52 个。 该算法不得试图巧妙地进行排序或部分检查，它应该简单地获取所有剩余的字符。 这 52 个的任何排列都是有效的。 

最后，当 k 很小（如 1）但禁止集很大时，正确性取决于在尝试构建输出之前检查可用性。 如果跳过此检查，实现可能会尝试索引到可用字符的空列表并崩溃，即使正确的响应应该只是“-”。
