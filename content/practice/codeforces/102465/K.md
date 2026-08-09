---
title: "CF 102465K - 不诚实的司机"
description: "我们有一个字符串描述旅行期间访问的位置的顺序。 压缩描述可以直接表示一个字符，连接两个已经压缩的描述，或者采用一个压缩描述并重复它任意正次数。"
date: "2026-08-08T09:31:30+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102465
codeforces_index: "K"
codeforces_contest_name: "2018-2019 ICPC Southwestern European Regional Programming Contest (SWERC 2018)"
rating: 0
weight: 102465
solve_time_s: 263
verified: true
draft: false
---

[CF 102465K - 不诚实的司机](https://codeforces.com/problemset/problem/102465/K)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个字符串描述旅行期间访问的位置的顺序。 压缩描述可以直接表示一个字符，连接两个已经压缩的描述，或者采用一个压缩描述并重复它任意正次数。 

压缩描述的成本不是描述中写入的字符数。 它是原子路径的数量，意味着压缩后保留在叶子上的单个字符的数量。 例如，`ababab`可以表示为`(ab)3`，其成本为 2，因为基本路径`ab`包含两个原子路径。 任务是找到整个字符串的最小可能成本。 

输入包含一个长度为 (N) 的字符串，其中 (1 \le N \le 700)。 字母表包含 62 个可能的字符，但字母表大小不影响算法。 重要的约束是 (N \le 700)。 三次算法执行大约 (700^3 \approx 3.43 \times 10^8) 基本迭代，因此实现必须避免在每个三次转换内进行额外的线性工作。 (O(N^4)) 解决方案太大，而 (O(N^3)) 动态程序是六秒限制的自然目标。 

有几种边缘情况很容易被错误处理。 单字符字符串，例如`a`答案为 1，因为没有可利用的重要重复或串联。 一个字符串，例如`aa`答案为 1，因为它是`(a)2`，因此将每个重复块视为需要其完整长度是错误的。 

一个更微妙的情况是`aaba`。 它的答案是 3，因为我们可以写`(a)2ba`，给出三个原子路径。 整个字符串不是周期性的，因此仅搜索覆盖整个间隔的一次重复的实现将错过最佳解决方案。 压缩可以嵌套在更大的串联内。 

另一个重要的情况是具有重复的字符串，其重复块本身是可压缩的。 为了`abababab`，我们可以写`(ab)4`， 但`ab`本身无法被压缩。 为了`aaaaaaaa`但是，整个字符串可以表示为`(a)8`，成本为 1。在找到重复项后停止而不递归地使用其基本间隔的最佳值的实现可能会返回太大的值。 

## 方法

 直接递归蛮力会尝试每一种可能的串联和每一种可能的重复。 这描述了正确的搜索空间，但可能的压缩树的数量呈指数增长，因此不切实际。 

第一个有用的改进是区间动态规划。 让`dp[i][j]`是从位置描述子串所需的最小原子路径数`i`通过位置`j`。 对于每个区间，只有两种根本不同的方式可以形成其最佳描述。 

第一种可能性是串联。 我们选择一个边界`k`并分别描述左右两部分。 这给出了

 [
 dp[i][j] = \min_{i \le k < j}(dp[i][k] + dp[k+1][j])。 
]

 第二种可能是重复。 如果子串的长度为 (L) 并且由长度为 (p) 的块的多个副本组成，则可以使用该块的压缩表示来描述整个子串。 因此

 [
 dp[i][j] = \min(dp[i][j], dp[i][i+p-1])。 
]

 强力间隔 DP 之所以有效，是因为每个有效压缩要么在其根处有串联，要么在其根处有重复。 它的问题是检查重复。 如果我们尝试每种可能的块长度并直接比较所有字符，则测试一个间隔可能需要 (O(L^2))，从而产生 (O(N^4)) 算法。 在所有时间间隔中，这大约是数百亿个字符比较 (N=700)。 

关键的观察结果是，检查子字符串是否有句点 (p) 不需要比较每个重复的副本。 一个字符串`s[i..i+L-1]`恰好有句点 (p) 当

 [
 s[i..i+L-p-1] = s[i+p..i+L-1]。 
]

 这两个子串具有相等的长度（L-p）。 如果我们知道每对后缀的最长公共前缀，则可以在 (O(1)) 中测试这个等式。 

我们可以在 (O(N^2)) 中预先计算所有最长的公共前缀。 然后在恒定时间内检查每个候选周期。 一个间隔只有 (O(N)) 个候选周期，因此在最坏的情况下重复处理贡献 (O(N^3))，与三次级联 DP 匹配。 

还有一种进一步的简化。 一旦我们知道了最小的有效周期，我们就不需要尝试每个有效周期。 假设区间有周期 (p) 和 (q)，其中 (p < q)。 如果 (q) 除以间隔长度，只要 (p) 是最小周期，长度 (q) 的块本身就是由较小基本块的副本组成的。 因此其最优压缩成本不能小于最小周期块的最优成本。 按升序搜索时间段可以让我们停在第一个有效的时间段上。 

官方分析提出了相同的区间DP结构，并通过KMP高效查找重复得到(O(N^3))。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 直接重复检查的强力间隔 DP | (O(N^4)) | (O(N^2)) | 太慢了 |
 | 具有 (O(1)) 周期性检查的间隔 DP | (O(N^3)) | (O(N^2)) | 已接受 |

 ## 算法演练

 1. 定义`dp[i][j]`作为压缩子字符串所需的最小原子路径数`s[i:j]`，使用半开区间。 单字符间隔的值为 1，因为单个字符本身就是一条原子路径。 
2. 预计算`lcp[i][j]`，从位置开始的后缀的最长公共前缀的长度`i`和`j`。 我们可以向后计算这个

 [
 lcp[i][j] =
 \开始{案例}
 1 + lcp[i+1][j+1], & s[i]=s[j],\
 0, & s[i]\ne s[j].
 \结束{案例}
 ]

 仅与`i < j`需要。 对角线也可以被填充，尽管对于过渡来说这不是必需的。 
3. 处理从 1 到 (N) 的子串长度。 当处理长度 (L) 的区间时，每个较短的区间都已被求解，因此其转换所需的所有值都可用。 
4. 开始`dp[i][j]`随着串联过渡。 对于每个分割位置`k`，结合最优描述`s[i:k]`和`s[k:j]`：

 [
 dp[i][j] = \min(dp[i][j], dp[i][k] + dp[k][j])。 
]

 这涵盖了最外层操作是串联的每个压缩。 
5. 搜索当前间隔的重复。 一个块的长度`p`只能在以下情况下使用`L % p == 0`，因为间隔必须包含整数个完整副本。 
6. 对于候选人`p`，比较第一个`L-p`以后缀开头的字符`p`稍后职位。 LCP 表立即告诉我们它们是否相等：

 [
 lcp[i][i+p] \ge L-p。 
]

 如果这成立，则整个区间由其第一个区间的副本组成`p`人物。 那么它的压缩成本就是`dp[i][i+p]`。 
7. 按升序尝试候选期。 一旦找到有效周期，它就是最小的周期，并且其块足以用于重复过渡。 如果没有找到周期，则区间只能在该级别使用串联。 
8. 处理完所有区间后，返回`dp[0][N]`，它代表整个输入字符串。 

### 为什么它有效

 考虑任何区间的最佳压缩表示。 如果它的最外层操作是串联，则有一些分割位置`k`，并且两个结果间隔都必须以最佳方式表示，否则用更好的表示替换其中之一将改善整个解决方案。 分裂过渡考虑了每一个这样的`k`。 

如果最外面的操作是重复，则该间隔由某个块的多个相同副本组成。 它的块长度是间隔长度的除数，LCP 条件准确检测该块是否在整个间隔内重复。 转换使用该块的最佳成本，因此它最佳地代表了重复。 

每个合法压缩都由这两种情况之一涵盖，而每个转换都构造一个合法压缩。 由于间隔是从短到长处理的，所以每个引用的`dp`值已经是最优的了。 通过区间长度归纳，每`dp[i][j]`是真正的最小值，并且`dp[0][N]`是必需的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve(s):
    n = len(s)

    # lcp[i][j] = length of the longest common prefix
    # of s[i:] and s[j:].
    lcp = [[0] * (n + 1) for _ in range(n + 1)]

    for i in range(n - 1, -1, -1):
        row = lcp[i]
        next_row = lcp[i + 1]
        si = s[i]
        for j in range(n - 1, i, -1):
            if si == s[j]:
                row[j] = next_row[j + 1] + 1

    # dp[i][j] is the answer for s[i:j].
    dp = [[0] * (n + 1) for _ in range(n + 1)]

    for i in range(n):
        dp[i][i + 1] = 1

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length
            best = length

            # Concatenation.
            dpi = dp[i]
            for k in range(i + 1, j):
                value = dpi[k] + dp[k][j]
                if value < best:
                    best = value
                    if best == 1:
                        break

            # Repetition.
            # A valid period must divide the whole length.
            p = 1
            while p * p <= length:
                if length % p == 0:
                    if p < length and lcp[i][i + p] >= length - p:
                        value = dp[i][i + p]
                        if value < best:
                            best = value

                    q = length // p
                    if q != p and q < length:
                        if lcp[i][i + q] >= length - q:
                            value = dp[i][i + q]
                            if value < best:
                                best = value

                p += 1

            dp[i][j] = best

    return dp[0][n]

def main():
    n = int(input())
    s = input().strip()
    print(solve(s))

if __name__ == "__main__":
    main()
```第一个嵌套循环构建 LCP 表。 它向后工作，因为`lcp[i][j]`仅取决于`lcp[i+1][j+1]`。 什么时候`s[i] == s[j]`，这两个后缀共享该字符，然后共享与其下一个后缀完全相同数量的附加字符。 

DP 使用半开区间。 因此`dp[i][j]`描述`s[i:j]`，其长度为`j-i`。 这种约定使串联和重复边界更加清晰。 分裂于`k`准确地产生`s[i:k]`和`s[k:j]`，没有重叠，也没有丢失字符。 

初始值`best = length`始终是有效的上限，因为我们可以让每个字符保持原子性。 然后串联循环会改进该值。 重复循环仅检查除数，因为重复块必须占据整数次。 

LCP 条件是核心实现细节。 对于开始于的间隔`i`与长度`length`， 时期`p`方法```
s[i : i + length - p] == s[i + p : i + length]
```两片都有长度`length-p`。 价值`lcp[i][i+p]`当它们相等时至少是这个长度。 

周期循环仅考虑平方根以下的除数并检查两者`p`和`length // p`。 这将每个间隔的周期候选数从 (O(N)) 减少到间隔长度的除数数。 最坏情况的复杂性仍然受 (O(N^3)) 限制，实际上，这使得 Python 实现比检查每个可能的周期要轻得多。 

Python 中不存在整数溢出问题。 在定宽语言中，DP值最多为(N)，因此普通的32位整数也足够了。 

## 工作示例

 ### 示例 1

 输入字符串是```
aaabaaabccdaaabaaabccd
```它的长度是22。最终的最优表示在结构上可以理解为重复的嵌套块。 DP 的重要部分是几个间隔成为周期性的，并且它们的重复块本身可以被压缩。 

最相关状态的紧凑轨迹是：

 | 间隔| 长度 | 最小有效期限| DP值|
 | ---| ---| ---| ---|
 |`a`| 1 | 无 | 1 |
 |`aaa`| 3 | 1 | 1 |
 |`aaab`| 4 | 无 | 2 |
 |`aaabaaab`| 8 | 4 | 2 |
 |`cc`| 2 | 1 | 1 |
 |`aaabaaabccdaaabaaabccd`| 22 | 22 嵌套重复和串联| 4 |

 最终值为 4。重复结构允许同一小组原子路径重复使用多次。 此示例说明了为什么重复必须与普通串联相结合。 整个字符串并不是简单地重复一个字符或一个短块。 

### 示例 2

 输入是```
aaba
```间隔`aa`是周期性的，周期为 1，所以

 [
 dp[0][2] = dp[0][1] = 1。 
]

 整个字符串不是周期性的，因此最佳构造来自于将其分成`aa`,`b`， 和`a`。 

| 间隔| 长度 | 过渡 | DP值|
 | ---| ---| ---| ---|
 |`a`| 1 | 原子| 1 |
 |`aa`| 2 | 重复`a`| 1 |
 |`aab`| 3 |`aa`+`b`| 2 |
 |`aaba`| 4 |`aa`+`b`+`a`| 3 |

 最终答案是 3。该跟踪表明重复在较大的串联中严格来说是有用的。 它还练习了整个间隔没有有用周期的情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(N^3)) | LCP 表花费 (O(N^2))，串联考虑每个 (O(N^2)) 间隔的 (O(N)) 分割，并且重复检查限制在相同的立方预算内。 |
 | 空间| (O(N^2)) | 这`dp`和`lcp`每个表都包含 (O(N^2)) 个条目。 |

 对于 (N \le 700)，二次内存要求在 256 MB 以内。 三次 DP 是此问题的预期规模，同时避免直接逐个字符的周期性检查可防止使用额外的 (N) 因子来实现直接实现 (O(N^4))。 官方竞赛分析还将 (O(N^3)) 确定为主要解决方案界限。 

## 测试用例```python
import sys
import io

def solve(s):
    n = len(s)

    lcp = [[0] * (n + 1) for _ in range(n + 1)]

    for i in range(n - 1, -1, -1):
        row = lcp[i]
        next_row = lcp[i + 1]
        si = s[i]
        for j in range(n - 1, i, -1):
            if si == s[j]:
                row[j] = next_row[j + 1] + 1

    dp = [[0] * (n + 1) for _ in range(n + 1)]

    for i in range(n):
        dp[i][i + 1] = 1

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length
            best = length

            for k in range(i + 1, j):
                value = dp[i][k] + dp[k][j]
                if value < best:
                    best = value
                    if best == 1:
                        break

            p = 1
            while p * p <= length:
                if length % p == 0:
                    if p < length and lcp[i][i + p] >= length - p:
                        best = min(best, dp[i][i + p])

                    q = length // p
                    if q != p and q < length:
                        if lcp[i][i + q] >= length - q:
                            best = min(best, dp[i][i + q])

                p += 1

            dp[i][j] = best

    return dp[0][n]

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(sys.stdin.readline())
    s = sys.stdin.readline().strip()
    return str(solve(s)) + "\n"

# Provided samples.
assert run("22\naaabaaabccdaaabaaabccd\n") == "4\n", "sample 1"
assert run("4\naaba\n") == "3\n", "sample 2"

# Minimum size.
assert run("1\na\n") == "1\n", "single character"

# No repetition, forcing ordinary concatenation.
assert run("2\nab\n") == "2\n", "non-repeating pair"

# All characters equal, maximum length.
assert run("700\n" + "a" * 700 + "\n") == "1\n", "maximum all-equal string"

# Repetition nested inside concatenation.
assert run("9\nabcabcabc\n") == "3\n", "three repetitions"

# Repetition of a block that is itself compressible.
assert run("8\naaaaaaaa\n") == "1\n", "nested repetition"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / a`| 1 | 最小尺寸间隔和原子基本情况 |
 |`2 / ab`| 2 | 非周期间隔和分裂过渡|
 |`700 / aaaaa...`| 1 | 最大输入大小和深度嵌套重复 |
 |`9 / abcabcabc`| 3 | 重复一个不平凡的块 |
 |`8 / aaaaaaaa`| 1 | 其自身表示也是可压缩的重复块 |

 ## 边缘情况

 单字符输入`a`给出`dp[0][1] = 1`立即地。 永远不需要重复循环，因为不存在更短的非空块，因此算法返回 1，而不依赖于特殊的压缩规则。 

为了`aa`，间隔长度为 2，候选周期为 1。LCP 值`lcp[0][1]`至少为 1，因此算法识别出`aa`作为两个副本`a`和集`dp[0][2]`到`dp[0][1] = 1`。 只考虑串联的粗心实现将返回 2。 

对于`aaba`, 区间`aa`被认为是重复，产生`dp[0][2] = 1`。 整个区间没有有效周期，所以它的答案来自于串联。 最佳分割有效产生`aa`,`b`， 和`a`, 给予`1 + 1 + 1 = 3`。 这捕获了假设有用的重复必须覆盖整个字符串的错误。 

为了`aaaaaaaa`，period-1 测试对于每个相关间隔都成功。 DP首先设立`dp[0][1] = 1`， 然后`dp[0][2] = 1`， 等等。 因此，完整间隔也得到值 1。这证实重复可以任意深度嵌套，而不需要 DP 重建实际的压缩树。 

为了`abababab`，周期 2 测试成功，因为前六个字符等于后两个位置的后缀。 因此该算法可以使用`dp[0][2]`，对于整个区间来说是 2。 字符串也有较大的周期（例如 4）并不重要，因为较小的重复块至少同样有用。 

两个串联区间之间的边界是用半开范围处理的。 为了`ab`，唯一的分割是`k = 1`, 给予`dp[0][1] + dp[1][2]`。 任一端点都没有分割，这可以防止空间隔进入循环，并避免此 DP 中最常见的逐一错误。 

最后，700 个相同字符的最大长度情况以最大尺寸执行动态程序的两个维度。 答案仍然是 1，并且每个区间都可以通过重复重复使用单字符表示。 该算法本身从不构造压缩表达式，因此其内存消耗保持二次方，而不是依赖于潜在的大量嵌套重复描述。
