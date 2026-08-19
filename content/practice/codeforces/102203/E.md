---
title: "CF 102203E - \u042d\u043d\u0435\u0440\u0433\u0435\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0441\u043f\u0435\u043a\u0442\u0440"
description: "我们有一个小写字符串 s。 对于每个正整数 i，定义一个特殊的字符串 fi。 第一个很简单。 要获取下一个字符串，请取出前一个字符串，将下一个字母放在中间，然后在右侧重复前一个字符串。"
date: "2026-08-18T00:46:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102203
codeforces_index: "E"
codeforces_contest_name: "\u0427\u0435\u0442\u0432\u0435\u0440\u0442\u0430\u044f \u041b\u0438\u043f\u0435\u0446\u043a\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e (8-11 \u043a\u043b\u0430\u0441\u0441\u044b)"
rating: 0
weight: 102203
solve_time_s: 245
verified: true
draft: false
---

[CF 102203E - \u042d\u043d\u0435\u0440\u0433\u0435\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0441\u043f\u0435\u043a\u0442\u0440](https://codeforces.com/problemset/problem/102203/E)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个小写字符串`s`。 对于每个正整数`i`,定义一个特殊的字符串`f_i`。 第一个很简单`a`。 要获取下一个字符串，请取出前一个字符串，将下一个字母放在中间，然后在右侧重复前一个字符串。 因此前几个字符串是`a`,`aba`,`abacaba`， 等等。 

我们需要计算有多少个子序列`s`等于任何这些特殊字符串。 不同的索引选择算作不同的子序列，即使它们产生相同的字母。 答案取模`998244353`。 

长度增长为

 [
 |f_i|=2|f_{i-1}|+1,
 ]

 所以

 [
 |f_i|=2^i-1。 
]

自从`|s| <= 5000`， 仅有的`f_1`通过`f_12`有可能发生，因为`f_12`有长度`4095`， 尽管`f_13`已经有长度了`8191`。 因此，26 个字母的明显限制与实际输入大小无关。 

直接枚举子序列是没有希望的。 长度为 5000 的字符串有 (2^{5000}) 个不同的索引子集。 即使在恒定时间内检查每个子集也是不可能的，并且构造相应的子序列将使工作量变得更大。 

还有几种边界情况可能会默默地破坏实现。 为了`a`，答案是`1`， 因为`f_1 = "a"`已经发生过一次。 一个实现从`f_2`会错误地打印零。 为了`b`，答案是`0`，因为没有`f_i`仅包含从以下位置开始的字母`b`，以及每一个`f_i`至少包含一个`a`。 计算任意单个字母的实现会错误地计算`b`。 

为了`aba`，答案是`3`。 有两种情况出现`f_1 = "a"`并且出现一次`f_2 = "aba"`。 这捕获了仅计算最大可能模式的实现。 为了`abcde`，答案是`1`: 有一个`a`， 但`f_2`需要两个`a`字符和`f_3`已经比整个字符串长了。 忘记快速增长的模式长度的实现可能会浪费工作或访问无效状态。 

最大尺寸案例`a`重复5000次就有答案`5000`。 仅有的`f_1`可能会发生，因为每个更大的`f_i`包含另一个字母。 这也是一个有用的压力情况，因为答案本身足够小，可以在输入达到最大长度时直接检查。 

## 方法

 最直接的暴力方法是枚举位置的每个子集`s`，构造相应的子序列，并检查它是否等于特殊字符串之一。 这是正确的，因为每个子序列都是由选自以下的索引唯一标识的：`s`。 然而，有 (2^n) 个子集，所以对于`n = 5000`该方法有 (2^{5000}) 个候选者。 如果构建或比较候选对象需要 (O(n))，那么最坏情况的工作是 (O(n2^n))，这远远超出了限制。 

更合理的第一次尝试是建立每一个相关的`f_i`并用标准子序列DP对其子序列进行计数。 对于一个图案`p`长度`m`， 维持`dp[j]`, 获得第一个的方法数`j`的字符`p`来自已处理的前缀`s`。 处理一个输入字符会更新包含该字符的所有模式位置。 这已经是多项式了，但是一个简单的实现会扫描所有`m`每个字符的图案位置。 

有用的观察结果是模式呈指数增长。 因为`f_i`长度为 (2^i-1)，只需要考虑大约 (\log_2 n) 个模式，并且它们的长度之和本身仅为 (O(n))。 我们还可以预先计算当前模式中每个字符的位置。 当一个角色`x`从`s`到达时，我们只更新那些特征为的模式位置`x`，而不是扫描不相关的位置。 

标准子序列 DP 有一个微妙的要求。 模式状态必须从右到左更新。 如果我们从左到右处理它们，新读取的字符可以在同一次迭代中使用多次，从而有效地允许一个位置`s`表示模式的多个字符。 颠倒顺序可以防止这种情况发生。 

对于最大可能的输入，所有相关级别上的模式位置总数为

 [
 (2^1-1)+(2^2-1)+\cdots+(2^{12}-1)=8178。 
]

 因此，该实现最多执行 (O(n\cdot 8178)) 次基本更新，根据给定的约束，这是 (O(n^2)) 次。 字符位置优化使得实际更新次数大大减少，特别是当输入不包含所需字母时。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n2^n)) | (O(n)) | (O(n)) | 太慢了 |
 | 带字符位置过滤的标准 DP | (O(n^2)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 阅读`s`并让`n = len(s)`。 计算每个字母出现的次数`s`。 当某个模式需要的某些字符的副本数量多于输入所包含的数量时，这些频率可以让我们尽早停止。 
2. 开始于`pattern = "a"`。 它的长度为 1，因此它是第一个可能出现的模式。 
3. 在对模式进行计数之前，请验证其所需的字符重数是否存在于`s`。 在`f_i`, 字符`a`出现 (2^{i-1}) 次，该字符`b`出现 (2^{i-2}) 次，依此类推，而最新字符出现一次。 如果任何所需的计数不可用，则也不会出现更大的模式，因此循环可以停止。 
4. 构建数组`positions`包含当前模式内每个字符从一开始的位置。 例如，对于`aba`，位置为`a`是`[1, 3]`，以及位置`b`是`[2]`。 这让 DP 跳过其字符无法与当前输入字符匹配的模式位置。 
5. 初始化子序列 DP`dp[0] = 1`。 这代表空图案，它总是可以以一种方式形成。 其他所有状态都从零开始。 
6. 处理字符`s`从左到右。 假设当前输入的字符是`x`。 占据所有位置`x`在模式中按降序排列。 对于每一个这样的职位`j`, 执行

 [
 dp[j] \mathrel{+}= dp[j-1]。 
]

 国家`dp[j-1]`描述了形成第一个的方法`j-1`使用当前输入字符作为模式字符之前的模式字符`j`。 
7. 添加`dp[len(pattern)]`到答案。 这正是子序列的数量`s`等于当前的`f_i`。 
8. 使用构建下一个模式

 [
 f_{i+1}=f_i+c_{i+1}+f_i。 
]

 当图案长度不超过时继续`n`和`i <= 26`。 

为什么它有效：处理任何前缀后`s`,`dp[j]`是从字符构成第一个的前缀中选择索引的方法数`j`当前模式的字符。 从右到左更新位置意味着当前字符最多使用一次。 因此，在处理完整个字符串后，`dp[len(pattern)]`对产生该模式的每个索引选择进行一次计数。 我们对每一个可能的情况独立执行此操作`f_i`，并且每个有效子序列都属于这些目标字符串之一，因为它们的长度不同。 因此，对计数求和即可得出所需的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def count_subsequences(s, pattern):
    m = len(pattern)

    positions = [[] for _ in range(26)]
    for j, ch in enumerate(pattern, 1):
        positions[ord(ch) - 97].append(j)

    dp = [0] * (m + 1)
    dp[0] = 1

    for ch in s:
        pos = positions[ord(ch) - 97]

        for j in reversed(pos):
            value = dp[j] + dp[j - 1]
            if value >= MOD:
                value -= MOD
            dp[j] = value

    return dp[m]

def solve(s):
    n = len(s)

    freq = [0] * 26
    for ch in s:
        freq[ord(ch) - 97] += 1

    answer = 0
    pattern = "a"

    for i in range(1, 27):
        length = len(pattern)
        if length > n:
            break

        feasible = True
        for j in range(i):
            # In f_i, character j appears 2^(i-j-1) times.
            need = 1 << (i - j - 1)
            if freq[j] < need:
                feasible = False
                break

        if not feasible:
            break

        answer += count_subsequences(s, pattern)
        if answer >= MOD:
            answer -= MOD

        if i == 26:
            break

        pattern = pattern + chr(97 + i) + pattern

    return answer

def main():
    s = input().strip()
    print(solve(s))

if __name__ == "__main__":
    main()
```这`count_subsequences`函数实现一种固定目标模式的标准子序列 DP。`dp[0]`被初始化为 1，因为只有一种方法可以选择空子序列。 对于每个输入字符，仅更新匹配的模式位置。 

这些位置存储为基于 1 的索引，因为`dp[j]`自然代表第一个`j`模式的字符。 反向迭代是关键的实现细节。 为了`pattern = "aa"`并输入字符`a`，例如更新必须先改变`dp[2]`使用旧的`dp[1]`，然后改变`dp[1]`。 否则都一样`a`可能会错误地贡献两次。 

模加法使用单个条件减法而不是`% MOD`对于每个转变。 两个操作数都已经低于模数，因此它们的总和低于`2 * MOD`，进行一次减法就足够了。 

可行性检查直接使用递归结构。 搬家时从`f_i`到`f_{i+1}`，每个现有字符数都会加倍，并且新字符会出现一次。 公式`1 << (i - j - 1)`准确地表达了这种多样性。 一旦某个模式因缺少某些字符而无法嵌入，则后面的每个模式也无法嵌入，因此外循环可以终止。 

模式本身永远不会超出输入长度。 由于其大小在每次迭代时都会加倍，因此最多有 12 个模式与`n <= 5000`。 

## 工作示例

 对于第一个样本，`s = "abacaba"`，相关模式是`a`,`aba`， 和`abacaba`。 下表显示了每个已处理字符后每个模式的完整出现次数。 

| 位置 | 人物 |`f1 = a`|`f2 = aba`|`f3 = abacaba`|
 | --- | --- | --- | --- | --- |
 | 0 | 空 | 0 | 0 | 0 |
 | 1 | 一个 | 1 | 0 | 0 |
 | 2 | 乙| 1 | 0 | 0 |
 | 3 | 一个 | 2 | 1 | 0 |
 | 4 | c | 2 | 1 | 0 |
 | 5 | 一个 | 3 | 2 | 0 |
 | 6 | 乙| 3 | 2 | 0 |
 | 7 | 一个 | 4 | 6 | 1 |

 最终计数为`4`,`6`， 和`1`, 给予`11`。 例如，当决赛`a`计数时进行处理`aba`，它扩展了每一个现有的`ab`子序列。 有四个这样的`ab`子序列，所以总数`aba`子序列变为六个。 

对于第二个样本，`s = "b"`。 第一个模式是`a`，但唯一的输入字符是`b`，所以它的 DP 保持为零。 

| 位置 | 人物 |`f1 = a`|`f2 = aba`|
 | --- | --- | --- | --- |
 | 0 | 空 | 0 | 0 |
 | 1 | 乙| 0 | 0 |

 既然连`f1`不会发生，更大的图案也不会发生。 答案是`0`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n^2)) | 相关模式的总长度为 (O(n))，每个输入字符仅处理匹配的位置。 |
 | 空间| (O(n)) | (O(n)) | 当前模式、其字符位置列表和 DP 数组都有总大小 (O(n))。 |

 为了`n <= 5000`，最大可能的目标长度为 4095，并且只有 12 个相关目标字符串。 呈指数级增长`f_i`是保持模式数量较少的原因，而字符位置过滤可以避免在无法与当前输入字符匹配的模式字符上花费时间。 该解决方案使用线性内存并符合规定的 256 MB 内存限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

MOD = 998244353

def count_subsequences(s, pattern):
    m = len(pattern)

    positions = [[] for _ in range(26)]
    for j, ch in enumerate(pattern, 1):
        positions[ord(ch) - 97].append(j)

    dp = [0] * (m + 1)
    dp[0] = 1

    for ch in s:
        for j in reversed(positions[ord(ch) - 97]):
            value = dp[j] + dp[j - 1]
            if value >= MOD:
                value -= MOD
            dp[j] = value

    return dp[m]

def solve(s):
    n = len(s)

    freq = [0] * 26
    for ch in s:
        freq[ord(ch) - 97] += 1

    answer = 0
    pattern = "a"

    for i in range(1, 27):
        if len(pattern) > n:
            break

        for j in range(i):
            if freq[j] < (1 << (i - j - 1)):
                return answer

        answer = (answer + count_subsequences(s, pattern)) % MOD

        if i == 26:
            break

        pattern = pattern + chr(97 + i) + pattern

    return answer

def run(inp: str) -> str:
    return str(solve(inp.strip()))

# provided samples
assert run("abacaba") == "11", "sample 1"
assert run("b") == "0", "sample 2"

# minimum-size input
assert run("a") == "1", "single-character input"

# f2 occurs once, and f1 occurs twice
assert run("aba") == "3", "basic recursive pattern"

# repeated pattern, four occurrences of aba and three occurrences of a
assert run("ababa") == "7", "multiple f2 occurrences"

# f2 already cannot occur because there are not two a's
assert run("abcde") == "1", "pattern-length and frequency boundary"

# maximum input size, only f1 can occur
assert run("a" * 5000) == "5000", "maximum-size all-equal input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a`|`1`| 最小尺寸和`f1`边界|
 |`aba`|`3`| 同时计数`f1`和`f2`|
 |`ababa`|`7`| 同一递归模式的多个子序列 |
 |`abcde`|`1`| 字符多样性不足且模式比输入长 |
 |`a`重复5000次|`5000`| 最大输入大小和全等字符 |

 ## 边缘情况

 对于`s = "a"`，算法开始于`f1 = "a"`。 频率检查成功，因为有一个`a`。 DP 变化自`[1, 0]`到`[1, 1]`，所以贡献是`1`。 下一个模式的长度为三，无法容纳，给出最终答案`1`。 

为了`s = "b"`，频率检查`f1`立即失败，因为`s`包含零`a`人物。 答案依然存在`0`，并且该算法不会尝试处理任何更大的模式。 

为了`s = "aba"`, 计数`f1`给出两次出现。 计数时`f2 = "aba"`，唯一有效的索引选择是`(1, 2, 3)`，所以第二个贡献是 1。 总计为`2 + 1 = 3`。 

为了`s = "abcde"`,`f1`发生一次。 图案`f2 = "aba"`需要两份`a`，但输入仅包含一个。 频率测试会在运行 DP 之前检测到这一点`f2`，并且所有后来的模式也是不可能的。 答案正是`1`。 

对于最大输入`s = "a" * 5000`,`f1`发生在每个位置，给出`5000`。 第二种模式需要一个`b`，它不存在，因此可行性检查立即停止。 不进行大DP，答案依然存在`5000`。
