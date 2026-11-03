---
title: "CF 176B - 文字剪切"
description: "每个操作选择当前单词的非空前缀和非空后缀并交换它们的顺序。 如果当前单词写为 xy，其中 x 和 y 都非空，则该操作将其转换为 yx。 将此操作视为循环旋转的一种有用方法。"
date: "2026-06-02T17:10:11+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 176
codeforces_index: "B"
codeforces_contest_name: "Croc Champ 2012 - Round 2"
rating: 1700
weight: 176
solve_time_s: 128
verified: true
draft: false
---

[CF 176B - 文字剪切](https://codeforces.com/problemset/problem/176/B)

 **评分：** 1700
 **标签：** dp
 **求解时间：** 2m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个操作选择当前单词的非空前缀和非空后缀并交换它们的顺序。 如果当前单词写为`xy`，其中两者`x`和`y`非空，该操作将其转换为`yx`。 

将此操作视为循环旋转的一种有用方法。 如果字长是`n`我们在位置后分开`p`, 长度后缀`n-p`移动到前面。 每个分裂恰好对应于一次非平凡旋转，并且每个非平凡旋转恰好对应于一次分裂。 

的话`start`和`end`长度相等`n`， 在哪里`2 ≤ n ≤ 1000`。 我们必须准确地计算出有多少个序列`k`拆分操作变换`start`进入`end`。 不同的分割位置会产生不同的操作，因此如果两个序列在​​某个步骤选择不同的分割点，则认为它们是不同的。 

单词的长度最多为1000，但是`k`可以达到`10^5`。 任何明确跟踪所有可能的操作序列的算法都是没有希望的。 即使为每次旋转和每一步保持 DP 状态也需要大约`1000 × 100000 = 10^8`过渡，这太多了。 

关键的观察是每个操作都保留字符的循环顺序。 从一个单词开始，我们只能达到它的旋转。 如果`end`不是一个旋转`start`，答案立即为零。 

一些边缘情况很容易被忽略。 

考虑：```
ab
ab
0
```答案是`1`。 我们已经从目标开始并且不执行任何操作。 假设至少存在一个操作的解决方案将错误地返回`0`。 

考虑：```
aaaa
aaaa
1
```每次分割都会产生相同的可见字符串`"aaaa"`，但是操作仍然不同，因为它们使用不同的分割位置。 有`3`有效的单步序列。 将状态视为字符串而不计算不同的分割会导致计数不足。 

考虑：```
abcd
bcda
1
```仅有一个有效的分割。 向左旋转一个位置对应于在第一个字符之后进行分割。 对目标旋转的出现次数而不是实际操作路径进行计数的解决方案可能会过度计数。 

## 方法

 蛮力的想法很简单。 每一步都尝试一切`n-1`可能的分割位置并递归生成结果单词。 恰好之后`k`运算，检查最后的单词是否等于`end`。 

这是正确的，因为它探索了每一个合法的操作顺序。 不幸的是，分支因子是`n-1`，因此探索状态的数量大致为`(n-1)^k`。 即使对于很小的值`k`，这变得巨大。 

下一个想法是观察拆分操作的真正作用。 位置后分割`p`将字符串旋转`n-p`职位。 重复分割永远不会改变字符的循环顺序。 每个可到达的单词只是简单的旋转`start`。 

假设长度是`n`。 最多有`n`不同的旋转状态。 我们可以构建一个图，其顶点是旋转，其边对应于选择其中一个`n-1`不平凡的旋转。 从任何旋转开始，每隔一个旋转都可以通过一次移动达到，而只有通过恰好产生相同字符串的旋转才能保持相同的旋转。 

关键的简化来自于将旋转仅分为两类：

 第一类包含等于`end`。 

第二类包含不等于的旋转`end`。 

让`cnt`是 的旋转数`start`等于`end`。 

那么每次旋转都属于两个类之一，并且转换仅取决于类，而不取决于特定的旋转。 这将问题转化为一个两态 DP，可以处理最多`10^5`步骤。 

要使用这个DP，我们必须知道是否旋转`0`的`start`已经等于`end`，以及总旋转次数等于`end`。 这两个量都可以通过搜索出现的次数来获得`end`里面`(start + start)[:-1]`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((n-1)^k) | O((n-1)^k) | O(k) | 太慢了|
 | 最佳 | O(n + k) | O(1) | O(1) | 已接受 |

 ## 算法演练

 ### 1. 计算目标旋转次数

 让```
T = start + start
```每旋转一次`start`对应于起始位置`T`。 

搜索所有出现的`end`在`T[:-1]`。 出现的次数恰好是旋转的次数`start`等于`end`。 

调用这个值`cnt`。 

如果`cnt = 0`， 然后`end`不是一个旋转`start`，答案是`0`。 

### 2.确定初始状态

 让```
good0 = 1 if start == end else 0
```我们定义了两个 DP 状态。`good[i]`是旋转的方式数量等于`end`后`i`运营。`bad[i]`是旋转的方式数量不等于`end`后`i`运营。 

最初：```
good = good0
bad = 1 - good0
```正好有一个起始轮换。 

### 3. 导出转换计数

 假设我们目前处于良好的轮换状态。 

有`n-1`可能的分割位置。 

在所有旋转中等于`end`，其中之一是当前旋转本身。 由于每项操作都必须是不平凡的，因此我们不能原地踏步。 

所以从一个好状态到另一个好状态的转换次数是：```
cnt - 1
```从好状态到坏状态的转换次数为：```
n - cnt
```现在假设我们的轮换情况很糟糕。 

其中`cnt`良好的旋转，一举即可到达。 

对于不好的目的地，一轮旋转就是当前状态本身，无法选择。 因此：```
good transitions = cnt
bad transitions = n - cnt - 1
```### 4.更新DP

 对于每个步骤：```
new_good =
    good * (cnt - 1)
    + bad * cnt

new_bad =
    good * (n - cnt)
    + bad * (n - cnt - 1)
```所有计算均以模进行`10^9+7`。 

### 5. 重复 k 次操作

 应用过渡`k`次。 

答案就是最终的值`good`。 

### 为什么它有效

 原问题的每个状态都是一个旋转`start`。 与最终目标相关的唯一信息是轮换是否等于`end`。 

让`cnt`是表示的旋转数`end`。 从任何旋转中，选择分割等同于选择任何其他旋转索引。 好状态和坏状态的传出边的数量仅取决于当前状态是好还是坏。 它不依赖于特定的旋转。 

由于同一类别内的所有状态都具有相同的转换行为，因此将它们聚合为两个 DP 状态可以保留路径的确切数量。 循环对每个有效的分割位置序列计数一次，且仅计数一次。 准确处理后`k`运营，`good`等于以等于的旋转结束的操作序列的数量`end`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1000000007

def kmp_count(text, pattern):
    m = len(pattern)

    pi = [0] * m
    j = 0
    for i in range(1, m):
        while j > 0 and pattern[i] != pattern[j]:
            j = pi[j - 1]
        if pattern[i] == pattern[j]:
            j += 1
        pi[i] = j

    cnt = 0
    j = 0
    for ch in text:
        while j > 0 and ch != pattern[j]:
            j = pi[j - 1]
        if ch == pattern[j]:
            j += 1
        if j == m:
            cnt += 1
            j = pi[j - 1]

    return cnt

def solve():
    start = input().strip()
    end = input().strip()
    k = int(input())

    n = len(start)

    cnt = kmp_count((start + start)[:-1], end)

    if cnt == 0:
        print(0)
        return

    good = 1 if start == end else 0
    bad = 1 - good

    for _ in range(k):
        new_good = (good * (cnt - 1) + bad * cnt) % MOD
        new_bad = (good * (n - cnt) + bad * (n - cnt - 1)) % MOD

        good = new_good
        bad = new_bad

    print(good)

if __name__ == "__main__":
    solve()
```第一部分计算`cnt`，旋转次数`start`等于`end`。 使用 KMP 可以使该步骤在字符串长度上保持线性。 

表达式`(start + start)[:-1]`很重要。 如果不删除最后一个字符，原始旋转将出现两次，从而导致额外的匹配。 

DP 仅存储两个值。`good`计算以目标旋转结束的方式，同时`bad`计算着在别处结束的方法。 转移系数直接来自计算进入每个类别的拆分操作的数量。 

一个微妙的点是这个术语`cnt - 1`在从好到好的转变中。 良好的旋转之一是当前旋转本身，但是拆分操作必须在两侧都是非空的，因此不允许将保持相同的旋转作为操作。 忘记这个减法是这个问题中最常见的错误。 

## 工作示例

 ### 示例 1

 输入：```
ab
ab
2
```这里`n = 2`。 

轮换是：```
ab
ba
```仅旋转一圈就等于`end`， 所以`cnt = 1`。 

初始状态：```
good = 1
bad = 0
```| 步骤| 好| 坏|
 | --- | --- | --- |
 | 0 | 1 | 0 |
 | 1 | 0 | 1 |
 | 2 | 1 | 0 |

 回答：```
1
```该轨迹表明唯一可能的分裂在两次旋转之间交替。 

### 示例 2

 输入：```
ababab
ababab
1
```旋转等于`"ababab"`发生在位置`0`,`2`， 和`4`。 

因此：```
cnt = 3
n = 6
```初始状态：

 | 步骤| 好| 坏|
 | --- | --- | --- |
 | 0 | 1 | 0 |

 一次操作后：

 | 步骤| 好| 坏|
 | --- | --- | --- |
 | 1 | 2 | 3 |

 回答：```
2
```这两个有效操作正是仍然产生相同可见字符串的两个重要旋转。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + k) | KMP 运行时间为 O(n)，DP 执行 k 次迭代 |
 | 空间| O(n) | KMP 前缀表存储 O(n) 值 |

 和`n ≤ 1000`和`k ≤ 100000`，大约十万个 DP 更新是微不足道的。 该算法很好地满足了时间和内存的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

MOD = 1000000007

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def kmp_count(text, pattern):
        m = len(pattern)

        pi = [0] * m
        j = 0
        for i in range(1, m):
            while j > 0 and pattern[i] != pattern[j]:
                j = pi[j - 1]
            if pattern[i] == pattern[j]:
                j += 1
            pi[i] = j

        cnt = 0
        j = 0
        for ch in text:
            while j > 0 and ch != pattern[j]:
                j = pi[j - 1]
            if ch == pattern[j]:
                j += 1
            if j == m:
                cnt += 1
                j = pi[j - 1]

        return cnt

    start = input().strip()
    end = input().strip()
    k = int(input())

    n = len(start)
    cnt = kmp_count((start + start)[:-1], end)

    if cnt == 0:
        return "0"

    good = 1 if start == end else 0
    bad = 1 - good

    for _ in range(k):
        ng = (good * (cnt - 1) + bad * cnt) % MOD
        nb = (good * (n - cnt) + bad * (n - cnt - 1)) % MOD
        good, bad = ng, nb

    return str(good)

# provided sample
assert run("ab\nab\n2\n") == "1", "sample 1"

# custom cases
assert run("ab\nab\n0\n") == "1", "zero operations"
assert run("ab\nba\n1\n") == "1", "single valid rotation"
assert run("abcd\nabcd\n1\n") == "0", "cannot stay in place"
assert run("aaaa\naaaa\n1\n") == "3", "all rotations equal"
assert run("abcd\nacbd\n5\n") == "0", "target not a rotation"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`ab ab 0`|`1`| 没有任何操作的基本情况 |
 |`ab ba 1`|`1`| 单一非平凡旋转|
 |`abcd abcd 1`|`0`| 禁止保持同一轮换 |
 |`aaaa aaaa 1`|`3`| 多次旋转产生相同的字符串 |
 |`abcd acbd 5`|`0`| 目标不是开始 | 的旋转

 ## 边缘情况

 考虑：```
ab
ab
0
```我们有`cnt = 1`。 初始状态是`good = 1`,`bad = 0`。 自从`k = 0`，DP 不执行任何转换。 答案依然存在`1`。 这正确地计算了空操作序列。 

考虑：```
aaaa
aaaa
1
```所有四次旋转都等于`"aaaa"`， 所以`cnt = 4`。 最初`good = 1`。 

一步之后：```
good = 1 * (4 - 1) = 3
```正好有三个合法的分割位置，它们都产生目标字符串。 该算法对操作进行计数，而不是计算不同的结果字符串。 

考虑：```
abcd
abcd
1
```这里`cnt = 1`。 递归给出：```
good = 1 * (1 - 1) = 0
```唯一好的旋转是当前旋转，但是分割操作不能使旋转保持不变。 该算法正确地排除了这种不可能的转变。 

考虑：```
abcd
acbd
3
```

`acbd`不是一个旋转`abcd`，所以 KMP 发现`cnt = 0`。 算法立即返回`0`，反映了拆分操作保留循环顺序并且永远无法创建这种排列的事实。
