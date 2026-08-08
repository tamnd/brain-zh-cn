---
title: "CF 102436B - 特里树最小化"
description: "我们得到了小写字符串的集合。 我们可能会替换单个字母，每次替换都会花费一次操作。 在所有替换之后，我们从结果字符串构建一个普通的字典树。 目标不是直接减少替换数量。"
date: "2026-08-09T00:12:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102436
codeforces_index: "B"
codeforces_contest_name: "Innopolis Open 2019-2020, qualification, contest 1"
rating: 0
weight: 102436
solve_time_s: 81
verified: true
draft: false
---

[CF 102436B - Trie 最小化](https://codeforces.com/problemset/problem/102436/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了小写字符串的集合。 我们可能会替换单个字母，每次替换都会花费一次操作。 在所有替换之后，我们从结果字符串构建一个普通的字典树。 目标不是直接减少替换数量。 相反，我们首先希望生成的 trie 具有尽可能少的节点数，并且在实现最小 trie 大小的所有转换中，我们希望需要最少替换的转换。 

关键的结构事实是替换字母不会改变字符串长度。 假设最长的字符串的长度为 L。任何包含长度为 L 的字符串的 trie 必须在从 0 到 L 的每个深度上至少包含一个顶点，其中深度 0 是根。 因此，trie 树的顶点数不能少于 L+1。 通过让每个字符串在该字符串存在的每个位置使用相同的字符，我们总是可以精确地获得 L+1 个顶点。 生成的 trie 只是一条链，较短的字符串以中间顶点结束。 

所以实际的优化问题变得更加简单。 在位置 j 处，仅考虑长度大于 j 的字符串。 我们选择所有这些字符串将在该位置使用的一个字符。 如果某个字符在这些字符串中出现 k 次，则选择它需要每隔一个字符进行更改，因此成本是活动字符串的数量减去 k。 最好的选择是最常见的角色。 

这些约束使得需要近线性解决方案。 最多可以有 100000 个字符串，单个字符串的长度可以为 100000，字符总数最多为 1000000。与总输入大小成比例的解决方案是理想的。 即使额外的常数因子 26 也无害，因为字母表只包含 26 个小写英文字母。 对所有字符串对进行二次扫描，或任何枚举可能的变换字符串的方法，都是完全不切实际的。 

有几种边缘情况，粗心的实现可能会处理不当。 首先，单个字符串已经具有最小可能的特里树，因此不需要替换。```
1
abc
```正确的输出是`0`。 没有什么可以合并的，因为 trie 已经是一条链了。 

第二种情况涉及不同长度的字符串。 在较短字符串中不存在的位置处，该字符串不得参与频率计算。```
3
a
ab
bb
```在位置零处，字符是`a, a, b`，所以改变`b`到`a`成本一。 在位置一处，仅`ab`和`bb`存在，并且两者都已经包含`b`，所以成本为零。 正确答案是`1`。 对每个位置的每个输入字符串进行计数将错误地包括位置一处的单字符字符串。 

第三种边缘情况是频率平局。```
2
ab
ba
```在零位置，`a`和`b`每个都发生一次，因此更换是不可避免的。 同样的情况也发生在位置一处。 答案是`2`。 在平局中选择的特定字符不会影响替换的数量。 

## 方法

 思考这个问题的一种直接的暴力方式是为每个位置独立地决定最终的角色。 对于每个位置，我们可以尝试所有 26 个可能的字母，并计算需要更改的活动字符串数量。 如果总输入长度为S，则在最坏的情况下重新扫描每个可能的字母的相关字符需要26S个字符检查。 当 S=1000000 时，在考虑数据结构和 Python 开销之前，即进行 26000000 次检查。 在一秒的限制下，这是不必要的工作量，特别是当可以直接收集频率信息时。 

还有一种更糟糕的暴力解释，我们枚举每个可能的最大长度的最终字符串。 这将需要考虑最多 26 个 L 选择，即使对于非常小的 L，这也是不可能的。不需要此枚举的原因是不同位置的选择不会相互作用。 替换位置 j 处的字符对于位置 j+1 处出现的字符没有影响，因为替换不会插入或删除字符。 

关键的见解是逐层查看 trie。 在深度 j 处，每个长于 j 的字符串恰好贡献从其深度 j 前缀到其下一个字符的一条边。 如果两个这样的字符串在那里使用不同的字符，则特里树必须分支。 由于绝对下界是每个深度一个顶点，因此当每个深度仅使用一个字符时，可以精确地获得最小特里树。 

一旦认识到这一点，每个深度的优化都是独立的。 如果该位置出现了 c a ​ ,c b ​ ,…,c z ​ 26 个字母，则选择字母 x 的成本

 （活动字符串的数量）−c x ​ 。 

最小值是通过最大化 c x ​获得的。 因此，一个职位的贡献很简单

 活动弦 - 最大频率。 

我们可以在读取字符串时累积这些频率。 官方参考解决方案正是使用这个每个位置频率参数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 超过 26 种选择 | 暴力破解 O(26S) | O(S)| 不必要的缓慢 |
 | 枚举最终字符串 | O(26 升) | 指数| 不可能|
 | 最佳频率计数 | O(S+26L) | O(26L) | 已接受 |

 这里S是所有输入字符串的总长度，L是最大字符串长度。 

## 算法演练

 1. 读取所有字符串并为每个字符串位置维护一个频率数组。 对于位置 j，数组有 26 个计数器，每个小写字母一个。 当字符串包含字符时`c`在位置 j 处，增加相应的计数器。 我们只创建在某些字符串中实际出现的位置，因此较短的字符串自然会停止贡献。 
2. 处理完所有字符串后，独立检查每个位置。 其 26 个计数器的总和就是到达该位置的字符串数量。 这不一定是 n，因为比当前位置短的字符串在该深度的 trie 中不存在。 
3. 找出该位置的 26 个字母中出现频率最大的。 为最终的字典树选择该字母可以节省那么多的替换，因为这些字符串已经包含所需的字符。 
4. 添加`active - best`到答案。 每个其他活动字符串都有不同的字符，因此需要在该位置进行一次替换。 
5. 打印累计答案。 不需要构造结果字符串或特里树，因为只有替换的数量很重要。 

### 为什么它有效

 考虑任意位置 j。 由于替换字母不会改变长度，因此每个长于 j 的字符串仍必须在该位置贡献一个字符。 为了使 trie 具有尽可能少的节点数，在深度 j+1 处必须只有一个 trie 顶点，因此所有活动字符串必须具有相同的字符。 

假设该字符是 x。 每个在 j 处的原始字符不是 x 的活动字符串都需要进行一次替换，而每个已经包含 x 的字符串则不需要进行一次替换。 因此确切的成本是`active - count[x]`。 最便宜的选择是出现频率最高的角色。 

这个论点独立适用于每个位置。 在一个位置选择字符不能改变另一位置的字符或长度，因此分别最小化每个位置可以最小化替换总数。 生成的字符串在每个深度共享相同的前缀，产生单个链，从而产生最小可能的特里结构大小。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    # counts[j][c] = number of strings having character c at position j
    counts = []

    for _ in range(n):
        s = input().strip()

        while len(counts) < len(s):
            counts.append([0] * 26)

        for j, ch in enumerate(s):
            counts[j][ord(ch) - ord('a')] += 1

    ans = 0

    for row in counts:
        active = sum(row)
        best = max(row)
        ans += active - best

    print(ans)

if __name__ == "__main__":
    solve()
```这`counts`数组代表整个优化所需的信息。`counts[j]`包含该位置每个字母的频率`j`。 这`while`仅当新读取的字符串比所有先前的字符串长时，循环才会增长结构。 

对于每个输入字符串中的每个字符，都会增加一个计数器。 这正是第一个算法步骤中描述的数据收集，不需要构造 trie。 

输入处理后，`active = sum(row)`仅计算在该位置实际有字符的字符串。 这会自动处理不同的字符串长度。`best = max(row)`选择已经最常出现的字符。 区别在于该深度所需的最少替换次数。 

Python 中不存在整数溢出问题。 即使在固定宽度的语言中，答案也最多是总输入长度，即最多 1000000。该实现还避免了对单个字符串进行排序、散列或构造 trie 节点，从而使热循环与输入大小成比例。 

每个位置的 26 个元素行都很小，因为字母表是固定的。 由此产生的 26L 存储空间在规定的最大长度下最多为 260 万个计数器。 

## 工作示例

 官方的样例是：```
4
min
trie
task
mini
```最大长度为四，因此位置索引从零到三。 

| 职位| 活跃人物 | 频率 | 最佳| 贡献 | 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 米，t，t，米 | 米：2，t：2 | 2 | 2 | 2 |
 | 1 | 我，r，a，我 | i：2，r：1，a：1 | 2 | 2 | 4 |
 | 2 | n、i、s、n | n：2，i：1，s：1 | 2 | 2 | 6 |
 | 3 | e、k、i | e:1、k:1、i:1 | 1 | 2 | 8 |

 在前三个位置，两个字符串已经与最佳字符一致，两个需要更改。 在最终位置仅存在三个字符串，并且所有三个字符都不同，因此需要进行两次替换。 

一种可能的最佳结果是`min`,`mine`,`mine`,`mine`，如官方解释所示。 生成的 trie 是一条包含五个节点（包括根）的链，这是长度为 4 的最长字符串的最小可能值。 

第二个例子说明了不同的长度。```
3
a
ab
bb
```| 职位| 活跃人物 | 频率 | 最佳| 贡献 | 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 一个，一个，b | a：2，b：1 | 2 | 1 | 1 |
 | 1 | 乙，乙| 乙：2 | 2 | 0 | 1 |

 在零位置，改变`bb`进入`ab`更换一次需要花费费用。 在位置一处，单字符字符串`a`在此深度不存在，因此不能被计算在内。 剩下的两个字符串已经达成一致`b`，因此无需额外更换。 

最终的字符串可以是`a`,`ab`,`ab`，其 trie 是一条链。 答案是`1`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(S+26L) | 每个输入字符处理一次，然后扫描每个 26 计数器行 |
 | 空间| O(26L) | 为每个可能的位置存储一个 26 计数器数组 |

 这里S≤1000000且L≤100000。 该算法仅对每个输入字符执行少量操作，加上最多 260 万次计数器检查，因此它非常适合一秒时间限制的预期线性尺度方法。 

## 测试用例

 下面的测试工具使用与提交的解决方案相同的逻辑，但将其公开为函数，以便可以使用以下命令检查每个案例`assert`。```python
import io
import sys

def solve_data(inp: str) -> str:
    data = inp.split()
    it = iter(data)

    n = int(next(it))
    counts = []

    for _ in range(n):
        s = next(it)

        while len(counts) < len(s):
            counts.append([0] * 26)

        for j, ch in enumerate(s):
            counts[j][ord(ch) - ord('a')] += 1

    ans = 0

    for row in counts:
        ans += sum(row) - max(row)

    return str(ans)

# Provided sample
assert solve_data(
    """4
min
trie
task
mini
"""
) == "8", "sample 1"

# Minimum-size input
assert solve_data(
    """1
a
"""
) == "0", "single string needs no replacement"

# All strings are already identical
assert solve_data(
    """4
abc
abc
abc
abc
"""
) == "0", "all strings already form a chain"

# Different lengths, shorter strings must not affect later positions
assert solve_data(
    """3
a
ab
bb
"""
) == "1", "short strings must be ignored at deeper positions"

# Tie at every position
assert solve_data(
    """2
ab
ba
"""
) == "2", "ties require one replacement at each position"

# Maximum-size shape: 100000 strings of length 1
# 50000 are 'a', 50000 are 'b', so exactly 50000 replacements are needed.
inp = "100000\n" + "a\n" * 50000 + "b\n" * 50000
assert solve_data(inp) == "50000", "maximum-size input"

| Test input | Expected output | What it validates |
|---|---:|---|
| `1 / a` | `0` | Minimum-size input and already optimal trie |
| Four copies of `abc` | `0` | All-equal strings |
| `a`, `ab`, `bb` | `1` | Different lengths and inactive positions |
| `ab`, `ba` | `2` | Frequency ties and per-position independence |
| 100000 one-character strings, half `a`, half `b` | `50000` | Maximum input size and linear processing |

## Edge Cases

For a single string such as

```文本
 1
 ABC```

there is only one path in the trie. At position zero the only active character is `a`, so the contribution is zero. The same holds for positions one and two. The algorithm returns `0`, correctly recognizing that no branching exists.

For strings of different lengths,

```3
 一个
 ab
 BB```

the first position contains `a, a, b`, giving a contribution of `1`. At the second position, only `ab` and `bb` remain active. Both contain `b`, so the contribution is zero and the final answer is `1`. The implementation handles this because it increments a counter only when the current string actually has that position.

For tied frequencies,

```2
 ab
 巴```

position zero has one `a` and one `b`, so whichever final character we choose, one replacement is necessary. Position one has the same situation. The answer is `2`. The algorithm only needs the maximum frequency, so ties require no special handling.

For strings whose lengths reach the maximum allowed value, such as many strings of length 100000, the algorithm does not create trie nodes or compare strings against each other. It records one counter update per character and later scans 26 counters per position. This keeps the work bounded by the total input size plus a small alphabet factor.

The most common conceptual mistake is to optimize the trie by thinking about complete strings rather than trie depths. The example

```3
 一个
 ab
 BB
 ````

 显示了失败的原因。 字符串`a`在深度 0 处很重要，但在深度 1 处从 trie 中消失。 一旦逐层审视问题，立场的独立性就变得明确，解决方案就简化为频率计数。
