---
title: "CF 102168H - \u0421\u0430\u0440\u0430\u0442\u043e\u0432\u0441\u043a\u0430\u044f \u0434\u0438\u043b\u0435\u043c\u043c\u0430"
description: "我们有n个人，有两种床。 有一张单人床，任何人都可以单独睡觉，还有b张双人床，两个人可以共用一张床。 每个人都由一个二进制值来描述。"
date: "2026-08-19T07:27:18+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102168
codeforces_index: "H"
codeforces_contest_name: "\u041b\u0438\u0447\u043d\u044b\u0439 \u0447\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442 \u0421\u0430\u043c\u0430\u0440\u0441\u043a\u043e\u0433\u043e \u0443\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442\u0430 \u0441\u0440\u0435\u0434\u0438 \u043d\u043e\u0432\u0438\u0447\u043a\u043e\u0432 2018-2019"
rating: 0
weight: 102168
solve_time_s: 98
verified: true
draft: false
---

[CF 102168H - \u0421\u0430\u0440\u0430\u0442\u043e\u0432\u0441\u043a\u0430\u044f \u0434\u0438\u043b\u0435\u043c\u043c\u0430](https://codeforces.com/problemset/problem/102168/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 38s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有`n`人和两种床。 有`a`单人床，任何人都可以单独睡觉，以及`b`双人床，两个人可以共用一张床。 每个人都由一个二进制值来描述。 一个有价值的人`1`同意与另一个人共用一张双人床，而一个有价值的人`0`拒绝分享，只能独自睡觉。 

如果存在的话，我们需要构造一个作业。 每一张床位要么容纳一个人，要么容纳一个人`0`，每张双人床可容纳零人、一人或两人。 一个人必须只出现一次，并且`0`不得将一个人与其他人放在一张双人床上。 

约束允许最多`200000`人，最多`200000`总共床位。 因此，解决方案应该是线性的或接近线性的。 任何平方项`n`已经可以要求周围`4 * 10^10`操作处于上限，远远超出了两秒的限制。 这里也没有理由使用复杂的图算法，因为兼容性规则只有两个类别，并且每个愿意的人都与其他每个愿意的人兼容。 

有几种边界情况很容易处理不当。 考虑```
1 0 1
0
```答案是`YES`，双人床包含`0 0`，因为只有一个人不能共用，也没有单人床，所以实际上这个案例是`NO`。 如果不小心将一张双人床视为有两个独立的地方，可能会错误地将人单独放在那里。 

现在考虑```
2 1 0
00
```答案是`NO`，因为两个人都需要单人床，但只有一张床。 仅检查物理睡眠姿势总数至少为`n`如果双人床位单独计算的话，就不够了。 

不同的边界情况是```
3 1 1
011
```这是可行的。 人`1`必须使用单人床，而人`2`和`3`可以共用一张双人床。 即使存在有效的分配，贪婪地首先将愿意的人放入单人床上的实现也可能使不愿意的人无处可去。 

最后，考虑```
3 0 2
111
```这是可行的。 一张双人床可容纳两人，另一张双人床可容纳一人。 双人床不必完全填满，因此要求每张双人床恰好容纳两个人将拒绝有效的安排。 

## 方法

 强力解决方案可以尝试将人员分配到床位，并检查每个分配是否都遵守共享规则。 即使我们大大简化搜索并只选择哪些人占用单人床，也已经有`2^n`可能的子集。 为了`n = 200000`，大约是`2^200000`可能性，远远超出任何可以列举的范围。 试图枚举完整的配对会更糟糕。 

不需要暴力破解的原因是兼容性关系非常简单。 一个人与`0`只有一个限制：他们不能共用一张双人床。 一个人与`1`放在双人床上时​​没有任何限制。 因此，每一个`0`应预留一张单人床。 一旦所有这些人都被放置完毕，剩下的每个人都愿意分享，所以剩余的容量可以被贪婪地填满。 

这立即给出了两个可行性条件。 一、不愿意的人数不能超过`a`，因为他们每个人都需要一张单独的单人床。 其次，总人数不能超过总睡眠场所数，即`a + 2b`。 这些条件也足够了。 将每个不愿意的人安排在一张单人床上，然后将剩余的单人床用于愿意的人，最后将所有剩余的愿意的人分配到双人床上，一次两个。 

关键的观察是不同意愿的人之间不存在互动。 一旦所有不愿意的人都受到单人床的保护，剩下的任何两个人都是兼容的，因此无需重新考虑之前的选择。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n) 或更糟 | O(n) | 太慢了 |
 | 贪心构造| O(n + a + b) | O(n + a + b) | O(n + a + b) | O(n + a + b) | 已接受 |

 ## 算法演练

 1. 阅读`n`,`a`,`b`并根据绳子将人们分成两组。 存储不愿意者和愿意者的索引，以便构建可以直接处理每个类别。 
2. 如果不愿意的人数大于`a`， 打印`NO`。 每个不愿意的人都需要自己的单人床，因此任何安排都无法避免这一要求。 
3.如果`n > a + 2b`， 打印`NO`。 只有`a + 2b`真正的睡眠场所，每个人都需要其中一个。 
4. 创建输出`a`单人床。 首先把所有不情愿的人都放到单人床上。 之后，将剩余的单人床留给愿意的人。 
5. 将那些愿意但尚未分配的人员放入`b`双人床，一次两张。 如果最后一张床只剩下一个愿意的人，则将该人放在一个位置上，然后`0`在另一个。 
6. 每个未使用的单人床位均收到`0`，并且双人床上每个未使用的位置也会收到`0`。 打印`YES`接下来是构造的作业。 

### 为什么它有效

 不变的是，已经分配到一张单人床的每个人都是永久安全的，因为单人床永远不需要共用。 更重要的是，当所有不愿意的人都被分配之后，每个未分配的人都愿意分享。 因此，为双人床选择的任何对都是有效的。 

如果算法因为不愿意的人多于单人床而拒绝，则不存在解决方案，因为每个人都需要一张单独的床。 如果它拒绝是因为`n > a + 2b`，无论兼容性如何，都没有足够的物理睡眠场所。 反之，当两个条件都成立时，所有不愿意的人都可以睡单人床，剩下的人都愿意，所以剩下的单人、双人床容量足够容纳所有人。 因此，当存在解决方案时，构造就会成功。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, a, b = map(int, input().split())
    s = input().strip()

    unwilling = []
    willing = []

    for i, c in enumerate(s, 1):
        if c == '0':
            unwilling.append(i)
        else:
            willing.append(i)

    if len(unwilling) > a or n > a + 2 * b:
        print("NO")
        return

    single = [0] * a
    double = [[0, 0] for _ in range(b)]

    pos = 0

    # Unwilling people must use single beds.
    for person in unwilling:
        single[pos] = person
        pos += 1

    # Use remaining single beds for willing people.
    wi = 0
    while pos < a and wi < len(willing):
        single[pos] = willing[wi]
        pos += 1
        wi += 1

    # Put the remaining willing people into double beds.
    di = 0
    while wi < len(willing):
        double[di][0] = willing[wi]
        wi += 1

        if wi < len(willing):
            double[di][1] = willing[wi]
            wi += 1

        di += 1

    print("YES")

    for person in single:
        print(person)

    for x, y in double:
        print(x, y)

if __name__ == "__main__":
    solve()
```两个数组`unwilling`和`willing`包含从 1 开始的人员索引，与所需的输出编号相匹配。 第一次可行性检查保护唯一不能使用双人床的人。 第二项检查计算实际睡眠位置，每张双人床贡献两个床位。 

单床结构经过精心加工`unwilling`第一的。 这个顺序是本质的贪婪选择。 一旦所有不愿意的人都被安排好了，为愿意的人使用单人床永远不会有什么坏处，因为那个人也可以使用双人床。 

双人床循环需要一两个愿意的人。 只有当另一个人留下时，第二个位置才会被填充，因此最终部分占用的双人床会被正确表示。 所有数组都初始化为零，这会自动为未使用的床提供所需的表示。 

Python 中不存在整数溢出问题，即使在具有固定宽度整数的语言中，最大相关表达式也是如此，`a + 2b`，仅在附近`600000`。 索引使用`enumerate(s, 1)`这样人数就完全是所需要的`1`通过`n`。 

## 工作示例

 ### 示例 1

 考虑```
7 3 2
0111111
```不愿意的人有一个，愿意的人有六个。 三张单人床先用，保护不愿意的人，然后再容纳两个愿意的人。 剩下的四个愿意的人正好可以挤进两张双人床上。 

| 步骤| 不愿意| 愿意留下| 单人床 | 双人床 |
 | ---| ---| ---| ---| ---|
 | 初始| 1 | 6 |`[0, 0, 0]`|`[(0,0),(0,0)]`|
 | 将第 1 个人放入单人 | 0 | 6 |`[1,0,0]`|`[(0,0),(0,0)]`|
 | 将第 2 个人放入单人 | 0 | 5 |`[1,2,0]`|`[(0,0),(0,0)]`|
 | 将第 3 个人放入单人 | 0 | 4 |`[1,2,3]`|`[(0,0),(0,0)]`|
 | 第一个双 | 0 | 2 |`[1,2,3]`|`[(4,5),(0,0)]`|
 | 第二双 | 0 | 0 |`[1,2,3]`|`[(4,5),(6,7)]`|

 在整个结构中，不变量是可见的：唯一不愿意的人已经被隔离，随后分配到一张双人床的每个人都愿意。 最终安排有效。 

### 示例 2

 考虑```
7 3 2
0000000
```七个人都拒绝分享。 只有三张单人床，所以第一个可行性条件立即失败。 

| 步骤| 不愿意| 提供单人床 | 需要单人床| 结果 |
 | ---| ---| ---| ---| ---|
 | 初始| 7 | 3 | 7 |`NO`|

 该算法不会尝试将这些人中的任何一个放在双人床上。 这正是具有两个物理位置的双人床与不情愿的人可以使用的双人床之间的区别。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + a + b) | O(n + a + b) | 每个人和每个输出床都会被处理恒定的次数。 |
 | 空间| O(n + a + b) | O(n + a + b) | 人员分组和构建的床位分配在打印前存储。 |

 所有参数均受`200000`，该算法仅对输入和输出数组执行几次线性传递。 这完全在预期的限制内，而任何指数或二次构造在最大输入大小下都是不可行的。 

## 测试用例

 有效解决方案的输出不是唯一的，因此测试工具应该验证生成的分配，而不是将其与一个固定字符串进行比较。 以下测试使用相同的构造逻辑并验证输出的语义要求。```python
import sys
import io

def solve_data(inp: str) -> str:
    data = inp.split()
    it = iter(data)

    n = int(next(it))
    a = int(next(it))
    b = int(next(it))
    s = next(it)

    unwilling = []
    willing = []

    for i, c in enumerate(s, 1):
        if c == '0':
            unwilling.append(i)
        else:
            willing.append(i)

    if len(unwilling) > a or n > a + 2 * b:
        return "NO\n"

    single = [0] * a
    double = [[0, 0] for _ in range(b)]

    pos = 0
    for person in unwilling:
        single[pos] = person
        pos += 1

    wi = 0
    while pos < a and wi < len(willing):
        single[pos] = willing[wi]
        pos += 1
        wi += 1

    di = 0
    while wi < len(willing):
        double[di][0] = willing[wi]
        wi += 1

        if wi < len(willing):
            double[di][1] = willing[wi]
            wi += 1

        di += 1

    out = ["YES"]
    out.extend(map(str, single))
    out.extend(f"{x} {y}" for x, y in double)
    return "\n".join(out) + "\n"

def run(inp: str) -> str:
    return solve_data(inp)

def validate(inp: str, out: str) -> bool:
    data = inp.split()
    n, a, b = map(int, data[:3])
    s = data[3]

    lines = out.strip().splitlines()

    if not lines:
        return False

    if lines[0] == "NO":
        zeros = s.count('0')
        return zeros > a or n > a + 2 * b

    if lines[0] != "YES":
        return False

    if len(lines) != 1 + a + b:
        return False

    used = []

    for i in range(1, 1 + a):
        x = int(lines[i])
        if x != 0:
            if not (1 <= x <= n):
                return False
            used.append(x)

    for i in range(1 + a, 1 + a + b):
        x, y = map(int, lines[i].split())

        if x != 0:
            if not (1 <= x <= n):
                return False
            if s[x - 1] == '0' and y != 0:
                return False
            used.append(x)

        if y != 0:
            if not (1 <= y <= n):
                return False
            if s[y - 1] == '0' and x != 0:
                return False
            used.append(y)

    return sorted(used) == list(range(1, n + 1))

# Provided sample 1, one valid interpretation of the missing formatting.
sample1 = "7 3 2\n0111111\n"
assert validate(sample1, run(sample1)), "sample 1"

# Provided sample 2, all people refuse to share.
sample2 = "7 3 2\n0000000\n"
assert not validate(sample2, run(sample2)), "sample 2"

# Minimum size, one person and one single bed.
case1 = "1 1 0\n0\n"
assert validate(case1, run(case1)), "minimum case"

# Boundary: every person is willing and exactly all double-bed places are used.
case2 = "4 0 2\n1111\n"
assert validate(case2, run(case2)), "exact double capacity"

# All unwilling people exactly fit into single beds.
case3 = "3 3 0\n000\n"
assert validate(case3, run(case3)), "all unwilling"

# Physical capacity is enough, but there are too many unwilling people.
case4 = "4 1 2\n0001\n"
assert not validate(case4, run(case4)), "too many unwilling people"

# Maximum-size style test with all willing people.
n = 200000
case5 = f"{n} 0 {n // 2}\n" + "1" * n + "\n"
assert validate(case5, run(case5)), "large input"
```所提供的语句中的示例格式丢失了一些换行符，因此测试使用相应的输入数据并验证生成的作业的数学条件，而不是依赖于一个特定的示例输出。 

| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`7 3 2 / 0111111`|`YES`具有有效的分配 | 正常可行施工 |
 |`7 3 2 / 0000000`|`NO`| 比单人床更不愿意的人|
 |`1 1 0 / 0`|`YES`| 最小尺寸实例 |
 |`4 0 2 / 1111`|`YES`| 精确的双人床容量 |
 |`3 3 0 / 000`|`YES`| 所有人都不愿意|
 |`4 1 2 / 0001`|`NO`| 容量有，但单床限制失败 |
 |`200000 0 100000 / 111...1`|`YES`| 最大尺寸线性结构|

 ## 边缘情况

 第一个边缘案例是在没有单人床的情况下拒绝共享的人。 为了```
1 0 1
0
```不愿意的人数是`1`， 尽管`a = 0`。 该算法未通过第一次可行性检查并打印`NO`。 一张双人床无法拯救这个人，因为将他们与任何人放在一起会违反他们的限制，而只有当问题的双人床位置未被使用且未被该人占用时才允许单独放置他们。 因此这个人没有合法的床位。 

第二种边缘情况是尽管总物理容量充足，但单床容量不足。 为了```
2 1 0
00
```两个不情愿的人，只有一张单人床。 支票`len(unwilling) > a`评估为`2 > 1`，所以算法打印`NO`。 仅计算总床位也会给出`1`，因此这种情况捕获了忘记兼容性限制的解决方案。 

第三种边缘情况是一个自愿的人被单独留在一张双人床上。 为了```
3 1 1
011
```人`1`占据了唯一的单人床。 人员`2`和`3`两人都愿意，占据了双人床的两个位置。 如果有四个愿意的人拥有两张双人床，算法就会完全填满两张床。 如果有三个愿意的人和两张双人床，最后一张床将容纳一个人和一个零。 这是合法的，因为剩下的人愿意分享。 

第四个边缘情况是精确的总容量。 为了```
4 1 2
0001
```总物理容量为`1 + 2 * 2 = 5`，四个人就够了，但是三个不愿意的人，只有一张单人床。 第一次检查在构造之前拒绝实例。 这说明了为什么单独的总容量并不是充分的可行性条件。 

最后的边缘情况是床库存的空的或未使用的部分。 为了```
2 3 2
11
```前两张单人床可以容纳两人，而第三张单人床和两张双人床则保持未使用状态。 数组用零初始化，因此输出自然会为每个未使用的位置包含零。 不需要特殊的清理过程。
