---
title: "CF 1783E - 年度游戏"
description: "对于每个 Boss，Monocarp 会在他的第 a[i] 次个人尝试中杀死它，而 Polycarp 会在他的第 b[i] 次个人尝试中杀死它。 战斗被分成大小为 k 的块。 Monocarp 执行 k 次尝试，然后 Polycarp 执行 k 次尝试，然后再次 Monocarp，依此类推。"
date: "2026-06-09T11:08:07+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1783
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 141 (Rated for Div. 2)"
rating: 2300
weight: 1783
solve_time_s: 126
verified: false
draft: false
---

[CF 1783E - 年度游戏](https://codeforces.com/problemset/problem/1783/E)

 **评分：** 2300
 **标签：** 蛮力、数据结构、数学、数论
 **求解时间：** 2m 6s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 对于每个 Boss，Monocarp 都会在他的身上杀死它`a[i]`-个人的尝试，而波利卡普会用他的方式杀死它`b[i]`第-次个人尝试。 

战斗分为大小块`k`。 单果树表演`k`尝试，然后波利卡普执行`k`尝试，然后再次尝试 Monocarp，依此类推。 一旦一名玩家达到杀死 Boss 的尝试次数，该 Boss 就会死亡，并且两个计数器都会重置为下一个 Boss。 

我们必须找到每一个值`k`之间`1`和`n`这样 Monocarp 就能杀死所有 Boss。 

重要的约束是总和`n`在所有测试用例中，最多是`2·10^5`。 这立即排除了检查每个老板的每一个`k`通过模拟。 甚至一个`O(n²)`解决方案将执行大约`4·10^10`最坏情况下的操作。 

挑战在于将游戏过程转换为纯算术条件`a[i]`,`b[i]`， 和`k`。 

一些边缘情况很容易被误解。 

考虑一位老板`a=4`,`b=3`。 

为了`k=2`，尝试的顺序是：```
M: 1 2
P: 1 2
M: 3 4
```Monocarp 在 Polycarp 到达尝试 3 之前到达尝试 4，因此 Monocarp 获胜。 

为了`k=1`，顺序是：```
M:1
P:1
M:2
P:2
M:3
P:3
```波利卡普首先到达第三次尝试并获胜。 

一个天真的比较，例如检查是否`a < b`那就完全错误了。 

另一个微妙的情况是`a=b`。 

例子：```
a = 5
b = 5
```不管`k`，Monocarp 总是在每一轮中获得第一步。 当两名玩家都以相同的个人尝试次数击杀时，Monocarp 首先达到该尝试并获胜。 任何将平等视为损失的解决方案都会失败。 

最后的边缘情况发生在以下情况：`b < a`。 

例子：```
a = 5
b = 2
```Monocarp 仍然可以在足够大的情况下获胜`k`。 

为了`k=5`, Monocarp 进行尝试`1..5`在Polycarp做出任何动作之前，Monocarp立即杀死。 

答案不仅仅取决于是否`a`大于`b`。 

## 方法

 最直接的方法就是测试所有可能的方法`k`。 

对于固定老板和固定`k`，我们可以通过遵循大小交替的块来确定谁先杀死`k`。 对所有老板和所有价值观重复此操作`k`给出了正确的解决方案。 

不幸的是有`n`的可能值`k`和`n`老板们。 即使我们可以在恒定时间内评估一位老板，我们仍然需要`O(n²)`工作，当`n`达到`2·10^5`。 

关键的观察是，我们实际上并不关心谁为特定的老板和特定的人赢得了胜利。`k`通过模拟。 我们只需要描述一组坏值`k`。 

假设老板有参数`(a,b)`。 

如果`a ≤ b`，Monocarp 总是获胜。 他达到了他的`a`在波利卡普到达他的位置之前进行第次尝试`b`第 - 次尝试，平局对 Monocarp 有利，因为他先行动。 

有趣的案例是`b < a`。 

让```
ceil(a / k)
```是达到尝试所需的 Monocarp 块的数量`a`，并且类似地```
ceil(b / k)
```为波利卡普。 

如果这两个值不同，那么谁需要更少的区块，谁就先完成杀戮尝试。 

自从`b < a`，我们总是有```
ceil(b/k) ≤ ceil(a/k)
```Monocarp 仍能获胜的唯一方法是两个数量相等。 然后他们在同一对区块中达到了杀戮企图，并且 Monocarp 的区块首先出现。 

所以对于一个老板来说`b < a`, Monocarp 恰好在以下时间获胜$$\left\lceil \frac{a}{k} \right\rceil = \left\lceil \frac{b}{k} \right\rceil.$$现在是关键的简化。 

对于一个整数`x`，值`ceil(x/k)`仅当`k`与某些除数相交。 而不是明确地寻找所有好的东西`k`，我们标记所有不良间隔。 

观察一下$$\left\lceil \frac{a}{k} \right\rceil > \left\lceil \frac{b}{k} \right\rceil$$恰好当存在多个`k`躺在间隔中`[b, a-1]`。 

确实，如果有多个`m = t·k`满足$$b \le m < a,$$然后`b`和`a`属于不同的上限块，产生不同的上限值。 

等价地，`k`是不好的，如果一些倍数`k`在于`[b,a-1]`。 

而不是迭代`k`，我们处理每个坏区间`[b,a)`使用差异数组。 这导致了一个非常紧凑的`O(n log n)`风格解决方案，实现为`O(n log n)`通过倍数进行调和求和。 官方的解决方案通过区间计数的方式表达得更加优雅。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) 或更糟 | O(1) | O(1) | 太慢了 |
 | 最佳| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 ### 导出条件

 对于一个拥有`b < a`，只要存在多个，Monocarp 就会失败`k`里面：$$[b,\;a)$$因为那时$$\left\lceil \frac{a}{k}\right\rceil > \left\lceil \frac{b}{k}\right\rceil.$$所以每个这样的老板都禁止所有价值观`k`在该区间内至少有一个倍数。 

### 差异数组重构

 让`dx[x]`计算有多少个间隔`[b,a)`包含要点`x`。 

对于每一位老板来说`b < a`：```
dx[b] += 1
dx[a] -= 1
```取前缀和后，```
dx[x]
```等于覆盖整数点的坏区间数`x`。 

### 检查 k 的值

 一个值`k`如果禁止间隔均不包含以下任意倍数，则有效`k`。 

的倍数为`k`是：```
k, 2k, 3k, ...
```如果有多个`mk`位于禁止区间内，那么`dx[mk] > 0`。 

因此：```
k is valid
⇔ dx[mk] = 0 for every multiple mk of k
```### 算法

 1. 创建差异数组`dx`尺寸的`n+1`。 
2.对于每个老板：

 如果`b[i] < a[i]`，加上区间`[b[i], a[i])`进入差异数组。 
3. 计算前缀和，使得`dx[x]`成为覆盖的区间数`x`。 
4. 对于每一个`k`从`1`到`n`：

 检查所有的倍数`k`。 

如果每个倍数都满足`dx[multiple] = 0`， 然后`k`是一个有效的答案。 
5. 输出所有有效值。 

### 为什么它有效

 对于每一位老板来说`b < a`, 区间`[b,a)`准确地表示多个位置`k`会分开`b`和`a`进入不同的天花板块。 每当存在这样的多重存在时，波利卡普就会严格地提前达到他的杀戮企图，而摩诺卡普就会失去那个老板。 

对于每个整数点，前缀和数组存储有多少个丢失区间包含它。 的倍数`k`躺在任何失败的区间内就相当于某个 Boss 击败了 Monocarp。 

检查所有倍数`k`保证没有丢失区间包含多个`k`。 因此，每个 Boss 都是由 Monocarp 赢得的。 相反，如果某个倍数位于失败区间，则该老板就失败了。 表征是准确的，因此算法精确地返回所有有效值`k`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())

    out = []

    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))

        dx = [0] * (n + 2)

        for ai, bi in zip(a, b):
            if bi < ai:
                dx[bi] += 1
                dx[ai] -= 1

        for i in range(1, n + 1):
            dx[i] += dx[i - 1]

        ans = []

        for k in range(1, n + 1):
            ok = True

            m = k
            while m <= n:
                if dx[m] != 0:
                    ok = False
                    break
                m += k

            if ok:
                ans.append(k)

        out.append(str(len(ans)))
        out.append(" ".join(map(str, ans)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第一个循环构建禁止间隔的集合。 只有老板有`b < a`事情。 如果`a ≤ b`, Monocarp 总是会赢得那个 boss 并且没有限制`k`是需要的。 

差值数组存储常数时间内的区间加法。 前缀和之后，`dx[x]`告诉我们是否点`x`属于至少一个禁止区间。 

最后的循环使用经典的倍数谐波级数迭代。 对于固定的`k`，我们检查`k, 2k, 3k, ...`。 如果这些点中的任何一个被禁止区间覆盖，那么`k`无效。 

一个常见的错误是忘记区间是半开的，`[b,a)`。 官方的实现执行：```
dx[b] += 1
dx[a] -= 1
```这正好代表了这个范围。 使用`[b,a]`会错误地拒绝一些有效值`k`。 

## 工作示例

 ### 示例 1

 输入：```
n = 3
a = [1,1,1]
b = [2,3,1]
```没有老板满意的`b < a`。 

| 老板| 一个 | 乙| 添加间隔 |
 | ---| ---| ---| ---|
 | 1 | 1 | 2 | 无 |
 | 2 | 1 | 3 | 无 |
 | 3 | 1 | 1 | 无 |

 前缀和后：

 | x| dx[x] | dx[x] |
 | ---| ---|
 | 1 | 0 |
 | 2 | 0 |
 | 3 | 0 |

 检查每一个`k`：

 | k | 倍数 | 全为零？ |
 | ---| ---| ---|
 | 1 | 1,2,3 | 是的 |
 | 2 | 2 | 是的 |
 | 3 | 3 | 是的 |

 回答：```
1 2 3
```这演示了自动赢得每个老板的简单情况。 

### 示例 2

 输入：```
n = 4
a = [1,4,3,2]
b = [3,3,4,1]
```只有 Boss 2 和 4 贡献间隔。 

| 老板| 一个 | 乙| 间隔 |
 | ---| ---| ---| ---|
 | 2 | 4 | 3 | [3,4) |
 | 4 | 2 | 1 | [1,2) |

 前缀和后：

 | x| dx[x] | dx[x] |
 | ---| ---|
 | 1 | 1 |
 | 2 | 0 |
 | 3 | 1 |
 | 4 | 0 |

 现在测试每个`k`。 

| k | 倍数 | 覆盖多个？ | 有效 |
 | ---| ---| ---| ---|
 | 1 | 1,2,3,4 | 是的 | 没有|
 | 2 | 2,4 | 没有| 是的 |
 | 3 | 3 | 是的 | 没有|
 | 4 | 4 | 没有| 是的 |

 回答：```
2 4
```这个例子准确地展示了禁止间隔如何消除`k`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 前缀和为 O(n)，检查倍数使用调和级数`n/1 + n/2 + ... + n/n`|
 | 空间| O(n) | 数组和答案列表的区别|

 总和为`n`所有测试用例最多是`2·10^5`。 一个`O(n log n)`解决方案总共只执行几百万次操作，完全符合时间限制。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))

        dx = [0] * (n + 2)

        for ai, bi in zip(a, b):
            if bi < ai:
                dx[bi] += 1
                dx[ai] -= 1

        for i in range(1, n + 1):
            dx[i] += dx[i - 1]

        ans = []

        for k in range(1, n + 1):
            ok = True
            m = k

            while m <= n:
                if dx[m] != 0:
                    ok = False
                    break
                m += k

            if ok:
                ans.append(k)

        out.append(str(len(ans)))
        out.append(" ".join(map(str, ans)))

    return "\n".join(out)

# provided sample
assert run(
"""3
3
1 1 1
2 3 1
1
1
1
4
1 4 3 2
3 3 4 1
"""
) == (
"""3
1 2 3
1
1
2
2 4"""
)

# minimum size
assert run(
"""1
1
1
1
"""
) == (
"""1
1"""
)

# all bosses automatically won
assert run(
"""1
4
1 1 1 1
4 4 4 4
"""
) == (
"""4
1 2 3 4"""
)

# single forbidden interval [1,2)
assert run(
"""1
2
2 1
1 2
"""
) == (
"""1
2"""
)

# boundary interval ending at n
assert run(
"""1
5
5 1 1 1 1
1 5 5 5 5
"""
) == (
"""2
3 5"""
)
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`n=1`|`1`| 尽可能小的实例 |
 | 全部`a≤b`| 每一个`k`有效 | 未添加间隔 |
 | 间隔`[1,2)`| 仅有的`k=2`有效 | 半开区间处理 |
 | 间隔结束于`n`| 特定的可分性行为 | 差异数组中的边界更新 |

 ## 边缘情况

 考虑：```
n = 1
a = [5]
b = [5]
```这里`a = b`。 没有添加间隔，因为`b < a`是假的。 差异数组到处都保持为零。 每一个`k`通过倍数测试。 

这与游戏过程相匹配，因为 Monocarp 总是在 Polycarp 达到第五次尝试之前达到第五次尝试。 

考虑：```
n = 1
a = [5]
b = [2]
```间隔`[2,5)`已添加。 

为了`k = 1`, 倍数`2`位于区间内，所以`k`被拒绝。 

为了`k = 5`，唯一的多重检查是`5`，位于半开区间之外。 该算法接受`k=5`。 

这与实际游戏相符，Monocarp 在 Polycarp 移动之前进行了五次尝试。 

考虑：```
n = 1
a = [4]
b = [3]
```间隔为`[3,4)`。 

为了`k = 1`， 多种的`3`被覆盖，因此算法拒绝它。 

为了`k = 2`，倍数是`2`和`4`，两者都不属于`[3,4)`。 算法接受它。 

这正是 Monocarp 失败的例子`k=1`但赢得了`k=2`，确认区间特征正确捕获了游戏。
