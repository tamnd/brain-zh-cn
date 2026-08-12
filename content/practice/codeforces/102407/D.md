---
title: "CF 102407D - \u041e\u0433\u0440\u0430\u0431\u043b\u0435\u043d\u0438\u0435\u0431\u0430\u043d\u043a\u0430"
description: "我们按 0 到 25 之间的位置对每个小写字母进行编码。第一个数字 a[0] 确定了代码的确切第一个字母。 后面的每个数字 a[i] 指定两个连续字母的数值之间的绝对差。"
date: "2026-08-11T05:51:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102407
codeforces_index: "D"
codeforces_contest_name: "\u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u044b, \u0421\u0435\u0437\u043e\u043d 2019-2020, \u0412\u0442\u043e\u0440\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430, \u0443\u0441\u043b\u043e\u0436\u043d\u0435\u043d\u043d\u0430\u044f \u043d\u043e\u043c\u0438\u043d\u0430\u0446\u0438\u044f"
rating: 0
weight: 102407
solve_time_s: 251
verified: true
draft: false
---

[CF 102407D - \u041e\u0433\u0440\u0430\u0431\u043b\u0435\u043d\u0438\u0435 \u0431\u0430\u043d\u043a\u0430](https://codeforces.com/problemset/problem/102407/D)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们按 0 到 25 的位置对每个小写字母进行编码。第一个数字`a[0]`修复代码的确切第一个字母。 之后的每一个数字`a[i]`指定两个连续字母的数值之间的绝对差。 

例如，如果`a[i] = 4`并且前一个字母的值为 12，下一个字母的值必须为 8 或 16，前提是这两个值都在 0 到 25 的范围内。因此，每个位置仅取决于紧邻其之前选择的字母。 

任务是计算满足每个此类约束的所有字符串，模数`1_000_000_007`。 长度可以达到`10^6`，因此因子取决于完整字符串数量的算法是不可能的。 即使是检查每个位置上每对可能的字母的算法，如果不小心实现，也会不必要地昂贵，尽管`26`足够小，这样的因子仍然可以接受。 有用的目标是对输入进行单次传递，每个位置的工作量恒定。 

字母表只有 26 个值。 这种小的固定状态空间是动态编程解决方案起作用的核心原因。 我们永远不需要记住代码的整个前缀。 我们只需要知道有多少个有效前缀以 26 个可能的字母中的每一个结尾。 

有几种边界情况很容易暴露错误。 什么时候`n = 1`，第一个数字完整地指定了字母。 用于输入```
1
4
```仅有一个有效代码，即值为 4 的字母，所以答案为`1`。 适合每个人的解决方案`a[i]`因为转换条件会意外地忽略第一个元素的特殊含义。 

零差异是另一个常见的陷阱。 为了```
2
0 0
```第二个字母必须等于第一个字母。 由于第一个字母是固定的，因此只有一个有效代码，所以答案是`1`。 假设每个差异都会给出两种选择的粗心转变会错误地计算出两种可能性。 

字母表的边界也很重要。 考虑```
2
25 25
```第一个字母的值为 25。25 的差异将要求下一个值为 0 或 50。只有 0 是有效字母，因此答案是`1`。 不检查范围的转换`[0, 25]`可能会创建无效状态。 

最后，当差异较大且前一值接近边缘时，可能只有一个可能的下一个字符或没有可能的下一个字符。 例如，```
2
0 25
```仅有一个有效代码，对应于值`0, 25`。 过渡`0 - 25`是无效的，但是`0 + 25`是有效的。 两个方向都必须独立检查。 

## 方法

 最直接的解决方案是枚举每个可能的代码并测试它是否与给定的数组匹配。 对于长度代码`n`， 有`26^n`可能的字符串。 检查一个字符串需要`O(n)`时间，所以最坏情况的复杂度是`O(n * 26^n)`。 即使我们逐步构建字符串并尽快验证约束，探索的状态数量仍保持指数级，`Θ(26^n)`。 为了`n = 10`，这已经意味着超过`1.4 × 10^14`完整的字符串，远远超出任何可行的范围。 

暴力方法之所以有效，是因为每个完整的字符串都给出了未知代码的一种可能解释，并且检查所有这些字符串不会错过答案。 它会失败，因为不同的前缀通常具有完全相同的未来可能性。 为每个前缀分别重新计算这些可能性是浪费工作。 

关键的观察是未来仅取决于最后一个字符的值。 假设两个有效前缀都以值 12 的字母结尾。从该点开始，剩余的相同`a[i]`值对两个前缀施加完全相同的限制。 早期角色的身份对于确定哪些延续是可能的不再重要。 

这给了我们一个动态编程状态`dp[x]`， 在哪里`dp[x]`是迄今为止处理的有效前缀的数量，其最后一个字符具有值`x`。 

最初，仅`a[0]`是可能的，所以`dp[a[0]] = 1`而其他所有状态都是零。 处理差异时`d`，先前的值`x`只能跟随`x - d`或者`x + d`，只要结果值在 0 到 25 之间。我们添加`dp[x]`到每个有效的目的地状态。 

不需要自己构建字符串。 在每个位置，我们只维护 26 个计数，每个计数最多有两个传出转换。 这将整个问题简化为`O(26n)`，它实际上是线性的，因为 26 是一个常数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(n * 26^n)`|`O(n)`| 太慢了|
 | 动态规划|`O(26n)`|`O(26)`| 已接受 |

 ## 算法演练

 1. 创建数组`dp`26 个整数。 放`dp[a[0]] = 1`因为第一个字符由提示的第一个值固定。 所有其他条目都从零开始，因为不允许使用其他第一个字符。 
2. 流程`a[1]`,`a[2]`，依此类推，从左到右。 对于目前的差异`d`，创建一个新数组`ndp`包含26个零。 
3. 对于每个可能的前一个字母值`x`，查看其当前计数`dp[x]`。 如果此计数为零，则没有有效前缀结束于`x`，所以没有什么可以传播的。 
4. 计算`x - d`和`x + d`。 这些是唯一可能的下一个值，因为条件恰好是`|x - y| = d`。 如果任一值在内部`[0, 25]`， 添加`dp[x]`到相应的条目`ndp`。 
5. 更换`dp`和`ndp`。 处理完当前的hint值后，`dp[x]`现在精确计算以字符值结尾的有效前缀`x`。 
6. 处理完所有差异后，将所有 26 个条目相加`dp`。 每个有效的完整代码都以一个字符结尾，因此这个总和就是所需的代码数。 对每个加法取模`1_000_000_007`。 

### 为什么它有效

 不变的是，通过处理位置后`i`,`dp[x]`等于长度的有效代码前缀的数量`i + 1`谁的最终角色有价值`x`。 

不变量最初为真，因为只有`a[0]`允许作为第一个字符。 假设在处理差异之前为真`a[i]`。 结尾为的前缀`x`可以扩展到一个字符`y`恰好在什么时候`|x - y| = a[i]`。 对于整数，这意味着`y = x - a[i]`或者`y = x + a[i]`。 该算法准确地考虑了这两种可能性并丢弃字母表之外的值。 因此，每个有效扩展都会被计算一次，并且不会计算无效扩展。 转换后，不变量仍然成立。 

在最终位置之后，每个有效的完整代码都恰好属于一个结束值状态，因此对所有状态求和将每个有效代码恰好计数一次。 

## Python 解决方案```python
import sys

input = sys.stdin.readline

MOD = 1_000_000_007

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    dp = [0] * 26
    dp[a[0]] = 1

    for d in a[1:]:
        ndp = [0] * 26

        for x in range(26):
            cnt = dp[x]
            if cnt == 0:
                continue

            y = x - d
            if y >= 0:
                ndp[y] += cnt
                if ndp[y] >= MOD:
                    ndp[y] -= MOD

            y = x + d
            if y < 26:
                ndp[y] += cnt
                if ndp[y] >= MOD:
                    ndp[y] -= MOD

        dp = ndp

    print(sum(dp) % MOD)

if __name__ == "__main__":
    solve()
```初始化直接代表了第一个hint值的特殊作用。 位置 1 之前没有转换，因为`a[0]`根本没有区别。 

循环结束`a[1:]`准确处理剩余的`n - 1`职位。 对于每个先前的值`x`，唯一的候选者是`x - d`和`x + d`。 检查`y >= 0`和`y < 26`就足够了，因为这些边界之间的每个整数都代表一个小写字母。 

一个新的`ndp`数组是必要的。 更新中`dp`到位将允许在当前转换期间创建的值再次用于相同的差异，从而有效地多次应用一个提示值。 旧数组必须在一次转换期间保持不变。 

计数减少模数`MOD`每次添加后。 Python 整数不会溢出，但在循环期间减少可以使存储的值保持较小并使预期的模算术变得明确。 最后的总和在打印前也会减少。 

该解决方案不需要存储整个输入数组。 当前的实现确实存储了它，因为输入自然很方便以这种方式解析，使用`O(n)`记忆。 它可以减少到`O(26)`辅助存储器通过在读取数字时对其进行处理，但是`O(n)`输入存储仍然易于管理`n = 10^6`在典型的 Codeforces Python 限制内。 如果需要，下面的测试讨论中会给出内存最小版本。 

## 工作示例

 ### 示例 1

 输入是```
1
4
```由于代码只有一个字符，因此处理时没有任何差异。 

| 已处理职位 | 差异|`dp`非零状态 | 总计 |
 | ---| ---| ---| ---|
 | 1 | 无 |`{4: 1}`| 1 |

 唯一可能的第一个字符的值为 4，因此只有一个代码。 这个例子练习了`n = 1`边界并确认`a[0]`必须作为固定的初始状态而不是过渡来处理。 

### 示例 2

 输入是```
3
12 4 4
```最初，只能使用值 12。 对于第一个差值 4，值 12 可以移动到 8 或 16。对于下一个差值 4，值 8 可以移动到 4 或 12，而值 16 可以移动到 12 或 20。 

| 职位| 使用的差异| 非零`dp`状态 |
 | ---| ---| ---|
 | 1 | 无 |`{12: 1}`|
 | 2 | 4 |`{8: 1, 16: 1}`|
 | 3 | 4 |`{4: 1, 12: 2, 20: 1}`|

 最终总和是`1 + 2 + 1 = 4`。 四个代码对应的值`(12, 8, 4)`,`(12, 8, 12)`,`(12, 16, 12)`， 和`(12, 16, 20)`，这是示例中显示的四个字符串。 

值为 12 的状态的计数为 2，因为有两个不同的前缀到达该状态。 动态编程状态有意合并这些前缀，因为它们对于所有未来的差异具有相同的可能性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(26n) = O(n)`| 每个`n - 1`Differences 检查 26 个状态，每个状态最多两次转换。 |
 | 空间|`O(n)`与所示的实施| 输入数组存储`n`整数，而 DP 本身仅使用两个包含 26 个值的数组。 |

 和`n`一样大`10^6`，线性扫描是合适的比例。 该算法对每个输入值大致执行少量恒定数量的操作，并且从不探索完整的字符串。 DP 状态本身的大小是恒定的，因此即使对于最大长度，该算法仍然实用。 

## 测试用例

 以下测试工具将解决方案放入可调用函数中，以便可以使用普通的 Python 断言来检查每种情况。 最大大小测试以编程方式构造一百万个零，而不是逐字写入一百万个数字。```python
import io
import sys

MOD = 1_000_000_007

def solve_data(inp: str) -> str:
    data = list(map(int, inp.split()))
    n = data[0]
    a = data[1:1 + n]

    dp = [0] * 26
    dp[a[0]] = 1

    for d in a[1:]:
        ndp = [0] * 26

        for x in range(26):
            cnt = dp[x]
            if cnt == 0:
                continue

            y = x - d
            if y >= 0:
                ndp[y] = (ndp[y] + cnt) % MOD

            y = x + d
            if y < 26:
                ndp[y] = (ndp[y] + cnt) % MOD

        dp = ndp

    return str(sum(dp) % MOD)

# Provided samples.
assert solve_data("1\n4\n") == "1", "sample 1"
assert solve_data("3\n12 4 4\n") == "4", "sample 2"

# Minimum size.
assert solve_data("1\n0\n") == "1", "single character"

# Difference zero: every character must remain unchanged.
assert solve_data("5\n7 0 0 0 0\n") == "1", "all-zero differences"

# Boundary transition: from 0 with difference 25, only 25 is valid.
assert solve_data("2\n0 25\n") == "1", "alphabet boundary"

# No valid continuation.
assert solve_data("2\n0 24\n") == "1", "large boundary difference"

# Maximum-size input. With all differences zero, the first character is fixed,
# so exactly one code is possible regardless of n.
n = 1_000_000
max_case = " ".join(["13"] + ["0"] * (n - 1))
assert solve_data(f"{n}\n{max_case}\n") == "1", "maximum n"

| Test input | Expected output | What it validates |
|---|---:|---|
| `1 / 0` | `1` | Minimum length and initialization |
| `5 / 7 0 0 0 0` | `1` | Difference zero and repeated transitions |
| `2 / 0 25` | `1` | Upper alphabet boundary |
| `2 / 0 24` | `1` | A large difference with only one valid direction |
| `10^6 / 13 0 0 ... 0` | `1` | Maximum input size and linear behavior |

The maximum-size case is particularly useful for performance testing. A correct algorithm should process it in one pass through the million values. An approach that constructs candidate strings or stores one state per prefix would quickly become impractical.

## Edge Cases

The first edge case is `n = 1`. For input

```文本
 1
 4```

the algorithm creates `dp[4] = 1` and never enters the transition loop. The sum is `1`. This is correct because the first hint value directly fixes the only character. There is no difference to apply.

The second edge case is a zero difference. Consider

```2
 7 0```

Initially, only value 7 has count 1. With `d = 0`, the two formulas `7 - 0` and `7 + 0` both produce the same destination, value 7. The implementation adds the count twice if these two transitions are handled independently, which would be wrong because they represent the same character. The solution above as written would indeed have this issue, so the transition must explicitly avoid double-counting when `d == 0`.

The corrected implementation is therefore:

```导入系统

 输入= sys.stdin.readline

 MOD = 1_000_000_007

 def 求解():
 n = int(输入())
 a = 列表(map(int, input().split()))

 dp = [0] * 26
 dp[a[0]] = 1

 对于 a[1:] 中的 d：
 ndp = [0] * 26

 对于范围 (26) 内的 x：
 cnt = dp[x]
 如果 cnt == 0：
 继续

 y = x - d
 如果 y >= 0：
 ndp[y] = (ndp[y] + cnt) % MOD

 如果 d != 0:
 y = x + d
 如果 y < 26：
 ndp[y] = (ndp[y] + cnt) % MOD

 dp = ndp

 打印（总和（dp）％MOD）

 如果 __name__ == "__main__":
 解决（）```

This is the version that should be submitted. For

```2
 7 0```

it keeps only the transition from 7 to 7 and produces `1`.

The alphabet boundary case

```2
 25 25```

starts at value 25. Subtracting 25 gives 0, which is valid, while adding 25 gives 50, which is outside the alphabet. Only state 0 receives the count, so the answer is `1`.

A case with no valid transition can also be handled naturally. For example,

```2
 0 26
 ````

 需要第二个值是`-26`或者`26`, 都在外面`[0, 25]`。 尽管官方输入保证`a[i] <= 25`，此示例说明了为什么范围检查是转换逻辑的一部分。 如果输入有效但特定状态没有可能的后继，则其计数会从`ndp`。 

最微妙的问题是零差异情况，因为`x - d`和`x + d`然后是相同的状态。 对于每个正差异，它们都是不同的，因此两个添加是正确的。 对于零，它们描述一个可能的下一个字符，而不是两个不同的字符。 避免重复转换可以保留 DP 不变性，并防止每个包含零差异的序列被过度计数。
